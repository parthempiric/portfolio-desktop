import type { WebSocket } from "ws";
import type { IPty } from "node-pty";
import { config } from "../config.js";

interface Session {
  pty: IPty;
  ip: string;
  idleTimer: ReturnType<typeof setTimeout>;
}

const sessions = new Map<WebSocket, Session>();
const ipSessionCounts = new Map<string, number>();

export function getSessionCount(): number {
  return sessions.size;
}

export function getIpSessionCount(ip: string): number {
  return ipSessionCounts.get(ip) || 0;
}

export function canCreateSession(ip: string): boolean {
  if (sessions.size >= config.maxSessionsTotal) return false;
  if ((ipSessionCounts.get(ip) || 0) >= config.maxSessionsPerIp) return false;
  return true;
}

export function registerSession(ws: WebSocket, ptyProcess: IPty, ip: string): void {
  const idleTimer = setTimeout(() => {
    destroySession(ws);
    ws.close(4000, "Idle timeout");
  }, config.idleTimeoutMs);

  sessions.set(ws, { pty: ptyProcess, ip, idleTimer });
  ipSessionCounts.set(ip, (ipSessionCounts.get(ip) || 0) + 1);
}

export function resetIdleTimer(ws: WebSocket): void {
  const session = sessions.get(ws);
  if (!session) return;

  clearTimeout(session.idleTimer);
  session.idleTimer = setTimeout(() => {
    destroySession(ws);
    ws.close(4000, "Idle timeout");
  }, config.idleTimeoutMs);
}

export function destroySession(ws: WebSocket): void {
  const session = sessions.get(ws);
  if (!session) return;

  clearTimeout(session.idleTimer);

  try {
    session.pty.kill();
  } catch {
    // PTY may already be dead
  }

  const count = (ipSessionCounts.get(session.ip) || 1) - 1;
  if (count <= 0) {
    ipSessionCounts.delete(session.ip);
  } else {
    ipSessionCounts.set(session.ip, count);
  }

  sessions.delete(ws);
}

export function getSession(ws: WebSocket): Session | undefined {
  return sessions.get(ws);
}
