import IORedis from "ioredis";

let _client: IORedis | null = null;

export function getRedis() {
  if (!_client) {
    const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";
    _client = new IORedis(url, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
    });
    _client.on("error", (e) => console.error("Redis error:", e));
    _client.on("connect", () => console.log("✅ Redis connected"));
  }
  return _client;
}
