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
const app = express();

// Middleware
app.use(cookieParser());
// app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
// const allowedOrigins = [process.env.FRONTEND_URL, process.env.FRONTEND_URL2];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (allowedOrigins.includes(origin) || !origin) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

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
app.use("/api/admin", adminAuthMiddleware);

// Admin Routes
app.use("/api/admin", productRoutes);
app.use("/api/admin", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", categoryRoutes);
app.use("/api/admin", subCategoryRoutes);
app.use("/api/admin/cart", adminCartRouter);
app.use("/api/admin/address", adminAddressRouter);
app.use("/api/admin/order", adminOrederRouter);

// Common Routes
app.use("/api", commonRoutes);
app.use("/api", commonReviewsRoutes);
app.use("/api/product", commonproductRoutes);
app.use("/api/category", commonCategoryRoutes);
app.use("/api/subcategory", commonSubCategoryRoutes);
app.use("/api/cart", checkToken, commonCartRoutes);
app.use("/api/address", checkToken, commonAddressRoutes);
app.use("/api/order", checkToken, commonOrederRoutes);
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
