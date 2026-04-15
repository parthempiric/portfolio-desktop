import { config } from "../config.js";

export function validatePayloadSize(data: Buffer | string): boolean {
  const size = typeof data === "string" ? Buffer.byteLength(data, "utf8") : data.length;
  return size <= config.maxPayloadBytes;
}
