const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../../controller/admin/product/productController");

// Public routes
router.get("/product/", getAllProducts);
router.get("/product/:id", getProductById);

// Admin routes
router.post("/product/", createProduct);
router.put("/product/:id", updateProduct);
router.delete("/product/:id", deleteProduct);

module.exports = router;
