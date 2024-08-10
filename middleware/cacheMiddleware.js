const cache = (duration) => {
  return async (req, res, next) => {
    const key = "express" + (req.originalUrl || req.url);
    console.log(`Checking cache for key: ${key}`);
    try {
      if (!redisClient.isOpen) {
        console.warn("Redis client is not open, skipping cache");
        return next();
      }

      const cachedBody = await redisClient.get(key);
      console.log(`Cache result for ${key}:`, cachedBody ? "Hit" : "Miss");

      if (cachedBody) {
        console.log("Serving from cache");
        return res.send(JSON.parse(cachedBody));
      }

      console.log("Cache miss, proceeding to handler");
      res.originalSend = res.send;
      res.send = function (body) {
        console.log(`Caching response for ${key}`);
        redisClient.setEx(key, duration, JSON.stringify(body));
        res.originalSend(body);
      };

      next();
    } catch (error) {
      console.error("Redis cache error:", error);
      next();
    }
  };
};

module.exports = cache;
