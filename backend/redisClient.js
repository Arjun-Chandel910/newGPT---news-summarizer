require("dotenv").config();

const { createClient } = require("redis");

const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

// Add a log when connection is accepted
client.on("connect", () => {
  console.log("Redis connection accepted!");
});

client.connect();

module.exports = client;
