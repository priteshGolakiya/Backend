require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connection");
const errorHandler = require("./middleware/errorHandler");
const adminAuthMiddleware = require("./middleware/adminAuthMiddleware");
const checkToken = require("./middleware/authToken");

// ------------------COMMON IMPORTS------------------
const commonRoutes = require("./routes/common/common");
const commonproductRoutes = require("./routes/common/productRoutes");
const commonCategoryRoutes = require("./routes/common/commonCategoryRoutes");
const commonSubCategoryRoutes = require("./routes/common/commonSubCategoryRoutes.js");
const commonCartRoutes = require("./routes/common/cartRoutes.js");
const commonReviewsRoutes = require("./routes/common/commonReviewsRoutes.js");
const commonAddressRoutes = require("./routes/common/commonAddressRouter.js");
const commonOrederRoutes = require("./routes/common/userOrderRoutes.js");

// ------------------ADMIN IMPORTS------------------
const adminRoutes = require("./routes/admin/admin");
const adminCartRouter = require("./routes/admin/cartRoutes.js");
const categoryRoutes = require("./routes/admin/categoryRoutes");
const adminAddressRouter = require("./routes/admin/adminAddressRouter.js");
const subCategoryRoutes = require("./routes/admin/subCategoryRoutes");
const productRoutes = require("./routes/admin/productRoutes");
const reviewRoutes = require("./routes/admin/reviewRoutes");
const adminOrederRouter = require("./routes/admin/adminOrderRoutes.js");
const { createClient } = require("redis");
const app = express();

// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));

// Apply adminAuthMiddleware to all /api/admin routes
app.use("/admin", adminAuthMiddleware);

// Create Redis client
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
  socket: {
    connectTimeout: 10000,
    keepAlive: 5000,
    reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
  },
});
// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis in");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
})();

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (error) => {
  console.error("Redis error:", error);
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

process.on("SIGINT", async () => {
  await redisClient.quit();
  process.exit(0);
});

const cache = (duration) => {
  return async (req, res, next) => {
    const key = "express" + (req.originalUrl || req.url);
    console.log(`Checking cache for key: ${key}`);
    try {
      if (!redisClient.isOpen) {
        console.warn("Redis client is not open, skipping cache");
        return next();
      }

      // Change this line:
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

// Admin Routes
app.use("/admin", adminRoutes);
app.use("/admin/product", productRoutes);
app.use("/admin/reviews", reviewRoutes);
app.use("/admin/category", categoryRoutes);
app.use("/admin/subcategory", subCategoryRoutes);
app.use("/admin/cart", adminCartRouter);
app.use("/admin/address", adminAddressRouter);
app.use("/admin/order", adminOrederRouter);

// Common Routes
app.use("/", cache(900), commonRoutes);
app.use("/reviews", cache(900), commonReviewsRoutes);
app.use("/product", cache(900), commonproductRoutes);
app.use("/category", cache(900), commonCategoryRoutes);
app.use("/subcategory", cache(900), commonSubCategoryRoutes);
app.use("/cart", checkToken, cache(900), commonCartRoutes);
app.use("/address", checkToken, cache(900), commonAddressRoutes);
app.use("/order", checkToken, cache(900), commonOrederRoutes);
// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();
