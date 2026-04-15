import "dotenv/config";

export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "http://localhost:5173").split(",").map((s) => s.trim()),
  ptyShell: process.env.PTY_SHELL || "/bin/bash",
  ptyUser: process.env.PTY_USER || "portfolio-guest",
  maxSessionsPerIp: parseInt(process.env.MAX_SESSIONS_PER_IP || "2", 10),
  maxSessionsTotal: parseInt(process.env.MAX_SESSIONS_TOTAL || "10", 10),
  idleTimeoutMs: parseInt(process.env.IDLE_TIMEOUT_MS || "300000", 10),
  maxPayloadBytes: 1024,
};
