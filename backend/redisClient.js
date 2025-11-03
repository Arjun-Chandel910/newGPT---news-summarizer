const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

client
  .connect()
  .then(() => console.log("Redis client connected at localhost:6379 "))
  .catch((err) => console.error("Redis connection error:", err.message));

module.exports = client;
