import { createServer } from "http";
import { WebSocketServer } from "ws";
import { config } from "./config.js";
import { handleConnection } from "./ws/handler.js";

const server = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Portfolio Desktop PTY Server");
});

const wss = new WebSocketServer({
  server,
  path: "/ws/terminal",
  maxPayload: 4096,
});

wss.on("connection", handleConnection);

server.listen(config.port, () => {
  console.log(`PTY server listening on port ${config.port}`);
  console.log(`Allowed origins: ${config.allowedOrigins.join(", ")}`);
});
