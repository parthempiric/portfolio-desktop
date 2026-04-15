import type { WebSocket } from "ws";
import type { IncomingMessage } from "http";
import { config } from "../config.js";
import { checkRateLimit } from "../security/rateLimiter.js";
import { validatePayloadSize } from "../security/inputGuard.js";
import { spawnPty } from "../pty/manager.js";
import {
  canCreateSession,
  registerSession,
  destroySession,
  resetIdleTimer,
  getSession,
} from "../pty/session.js";

function getClientIp(req: IncomingMessage): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}

function checkOrigin(req: IncomingMessage): boolean {
  const origin = req.headers.origin;
  if (!origin) return true; // Allow non-browser clients
  return config.allowedOrigins.includes(origin);
}

export function handleConnection(ws: WebSocket, req: IncomingMessage): void {
  const ip = getClientIp(req);

  // Origin check
  if (!checkOrigin(req)) {
    ws.close(4001, "Origin not allowed");
    return;
  }

  // Rate limiting
  if (!checkRateLimit(ip)) {
    ws.close(4002, "Rate limit exceeded");
    return;
  }

  // Session cap
  if (!canCreateSession(ip)) {
    ws.close(4003, "Session limit reached");
    return;
  }

  // Spawn PTY
  let ptyProcess;
  try {
    ptyProcess = spawnPty();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    ws.send(JSON.stringify({ type: "error", message: `Failed to spawn PTY: ${message}` }));
    ws.close(4004, "PTY spawn failed");
    return;
  }

  registerSession(ws, ptyProcess, ip);

  // Send ready
  ws.send(JSON.stringify({ type: "ready" }));

  // PTY → Client
  ptyProcess.onData((data: string) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(data);
    }
  });

  ptyProcess.onExit(({ exitCode }) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({ type: "exit", code: exitCode }));
      ws.close(1000, "PTY exited");
    }
    destroySession(ws);
  });

  // Client → PTY
  ws.on("message", (rawData, isBinary) => {
    const session = getSession(ws);
    if (!session) return;

    resetIdleTimer(ws);

    // Binary = keystrokes
    if (isBinary) {
      const buf = rawData instanceof Buffer ? rawData : Buffer.from(rawData as ArrayBuffer);
      if (!validatePayloadSize(buf)) return;
      session.pty.write(buf.toString("utf-8"));
      return;
    }

    // Text = JSON commands
    const text = rawData.toString();
    if (!validatePayloadSize(text)) return;

    try {
      const msg = JSON.parse(text);
      if (msg.type === "resize" && typeof msg.cols === "number" && typeof msg.rows === "number") {
        session.pty.resize(
          Math.min(Math.max(msg.cols, 1), 500),
          Math.min(Math.max(msg.rows, 1), 200)
        );
      }
    } catch {
      // Ignore malformed JSON
    }
  });

  ws.on("close", () => {
    destroySession(ws);
  });

  ws.on("error", () => {
    destroySession(ws);
  });
}
