// redisClient.js
const redis = require("redis");

let redisClient = null;

const initRedis = async () => {
  try {
    console.log("Redis config:", {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD
        ? process.env.REDIS_PASSWORD
        : undefined,
    });

    const REDIS_CONFIG = {
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD,
      socket: {
        connectTimeout: 10000,
        keepAlive: 5000,
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
      },
    };

    redisClient = redis.createClient(REDIS_CONFIG);

    redisClient.on("error", (error) => {
      console.error("Redis Client Error:", error);
    });

    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    redisClient = null;
  }
};

const getRedisClient = () => redisClient;

module.exports = { initRedis, getRedisClient };
