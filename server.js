require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createClient } = require("redis");

const connectDB = require("./db/connection");
const errorHandler = require("./middleware/errorHandler");
const adminAuthMiddleware = require("./middleware/adminAuthMiddleware");
const checkToken = require("./middleware/authToken");

// Import routes
const commonRoutes = require("./routes/common/common");
const commonproductRoutes = require("./routes/common/productRoutes");
const commonCategoryRoutes = require("./routes/common/commonCategoryRoutes");
const commonSubCategoryRoutes = require("./routes/common/commonSubCategoryRoutes");
const commonCartRoutes = require("./routes/common/cartRoutes");
const commonReviewsRoutes = require("./routes/common/commonReviewsRoutes");
const commonAddressRoutes = require("./routes/common/commonAddressRouter");
const commonOrderRoutes = require("./routes/common/userOrderRoutes");

const adminRoutes = require("./routes/admin/admin");
const adminCartRouter = require("./routes/admin/cartRoutes");
const categoryRoutes = require("./routes/admin/categoryRoutes");
const adminAddressRouter = require("./routes/admin/adminAddressRouter");
const subCategoryRoutes = require("./routes/admin/subCategoryRoutes");
const productRoutes = require("./routes/admin/productRoutes");
const reviewRoutes = require("./routes/admin/reviewRoutes");
const adminOrderRouter = require("./routes/admin/adminOrderRoutes");

const app = express();

// Middleware
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "50mb" }));

// Apply adminAuthMiddleware to all /admin routes
app.use("/admin", adminAuthMiddleware);

// Redis setup
const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("error", (error) => console.error("Redis error:", error));
redisClient.on("connect", () => console.log("Redis client connected"));
redisClient.on("end", () => console.log("Redis connection closed"));

// Cache middleware
const cache = (duration) => {
  return async (req, res, next) => {
    if (req.method !== "GET") {
      return next();
    }

    const key = `express:${req.originalUrl || req.url}`;
    try {
      const cachedBody = await redisClient.get(key);
      if (cachedBody) {
        console.log("Response served from Redis cache:", key);
        return res.json(JSON.parse(cachedBody));
      }

      // Store the original json method
      const originalJson = res.json;

      // Override the json method
      res.json = function (body) {
        // Reset json to its original method immediately
        res.json = originalJson;

        // Cache the response
        redisClient.setEx(key, duration, JSON.stringify(body)).catch((err) => {
          console.error("Redis cache error:", err);
        });

        // Log that the response is coming from the controller
        console.log("Response served from controller and cached:", key);

        // Send the response
        return originalJson.call(this, body);
      };

      next();
    } catch (error) {
      console.error("Redis cache error:", error);
      next();
    }
  };
};

module.exports = cache;

// Admin Routes
app.use("/admin", adminRoutes);
app.use("/admin/product", productRoutes);
app.use("/admin/reviews", reviewRoutes);
app.use("/admin/category", categoryRoutes);
app.use("/admin/subcategory", subCategoryRoutes);
app.use("/admin/cart", adminCartRouter);
app.use("/admin/address", adminAddressRouter);
app.use("/admin/order", adminOrderRouter);

// Common Routes
app.use("/", cache(900), commonRoutes);
app.use("/reviews", cache(900), commonReviewsRoutes);
app.use("/product", cache(900), commonproductRoutes);
app.use("/category", cache(900), commonCategoryRoutes);
app.use("/subcategory", cache(900), commonSubCategoryRoutes);
app.use("/cart", checkToken, cache(900), commonCartRoutes);
app.use("/address", checkToken, cache(900), commonAddressRoutes);
app.use("/order", checkToken, cache(900), commonOrderRoutes);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await redisClient.connect();
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Gracefully handle shutdown
process.on("SIGINT", async () => {
  try {
    await redisClient.quit();
    console.log("Redis client disconnected on app termination");
  } catch (error) {
    console.error("Error during Redis client disconnection:", error);
  }
  process.exit(0);
});

startServer();
