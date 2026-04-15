const connectionTimes = new Map<string, number[]>();

const WINDOW_MS = 60_000;
const MAX_CONNECTIONS_PER_WINDOW = 5;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const times = connectionTimes.get(ip) || [];
  const recent = times.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_CONNECTIONS_PER_WINDOW) {
    connectionTimes.set(ip, recent);
    return false;
  }

  recent.push(now);
  connectionTimes.set(ip, recent);
  return true;
}

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, times] of connectionTimes) {
    const recent = times.filter((t) => now - t < WINDOW_MS);
    if (recent.length === 0) {
      connectionTimes.delete(ip);
    } else {
      connectionTimes.set(ip, recent);
    }
  }
}, 300_000);
