import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";

const CATPPUCCIN_THEME = {
  background: "#1e1e2e",
  foreground: "#cdd6f4",
  cursor: "#f5e0dc",
  cursorAccent: "#1e1e2e",
  selectionBackground: "#585b7066",
  black: "#45475a",
  red: "#f38ba8",
  green: "#a6e3a1",
  yellow: "#f9e2af",
  blue: "#89b4fa",
  magenta: "#f5c2e7",
  cyan: "#94e2d5",
  white: "#bac2de",
  brightBlack: "#585b70",
  brightRed: "#f38ba8",
  brightGreen: "#a6e3a1",
  brightYellow: "#f9e2af",
  brightBlue: "#89b4fa",
  brightMagenta: "#f5c2e7",
  brightCyan: "#94e2d5",
  brightWhite: "#a6adc8",
};

const WS_URL = `${location.protocol === "https:" ? "wss:" : "ws:"}//${location.host}/ws/terminal`;

export default function TerminalApp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      theme: CATPPUCCIN_THEME,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontSize: 13,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: "block",
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(containerRef.current);
    fitAddon.fit();

    termRef.current = term;
    fitAddonRef.current = fitAddon;

    // WebSocket connection
    const ws = new WebSocket(WS_URL);
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    ws.onopen = () => {
      setError(null);
    };

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "ready") {
            // Send initial size
            ws.send(JSON.stringify({ type: "resize", cols: term.cols, rows: term.rows }));
          } else if (msg.type === "error") {
            term.writeln(`\r\n\x1b[31mError: ${msg.message}\x1b[0m`);
          } else if (msg.type === "exit") {
            term.writeln(`\r\n\x1b[33mSession ended (exit code: ${msg.code})\x1b[0m`);
          }
        } catch {
          // Plain text from PTY
          term.write(event.data);
        }
      } else {
        // Binary data from PTY
        term.write(new Uint8Array(event.data));
      }
    };

    ws.onclose = () => {
      term.writeln("\r\n\x1b[90mConnection closed.\x1b[0m");
    };

    ws.onerror = () => {
      setError("Could not connect to terminal backend. Make sure the backend server is running (cd backend && npm run dev).");
    };

    // Terminal → WebSocket (keystrokes)
    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(new TextEncoder().encode(data));
      }
    });

    // Resize handling
    term.onResize(({ cols, rows }) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "resize", cols, rows }));
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      ws.close();
      term.dispose();
      termRef.current = null;
      wsRef.current = null;
      fitAddonRef.current = null;
    };
  }, []);

  if (error) {
    return (
      <div className="h-full bg-[#1e1e2e] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="text-[#f38ba8] text-sm font-medium mb-2">Terminal Unavailable</div>
          <div className="text-white/50 text-xs leading-relaxed">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full w-full bg-[#1e1e2e]"
      style={{ padding: "4px" }}
    />
  );
}
