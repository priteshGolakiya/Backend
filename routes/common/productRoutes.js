const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  searchProducts,
  getPaginatedProducts,
} = require("../../controller/common/product/productController.js");

// Public routes
router.get("/", getAllProducts);
router.get("/products", getPaginatedProducts);
router.get("/search", searchProducts);
router.get("/:id", getProductById);
module.exports = router;
