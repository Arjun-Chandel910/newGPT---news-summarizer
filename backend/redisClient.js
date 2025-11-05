const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "redis",
    port: process.env.REDIS_PORT || 6379,
  },
});

client
  .connect()
  .then(() =>
    console.log(
      `Redis client connected at ${process.env.REDIS_HOST || "redis"}:${
        process.env.REDIS_PORT || 6379
      }`
    )
  )
  .catch((err) => console.error("Redis connection error:", err.message));

module.exports = client;
