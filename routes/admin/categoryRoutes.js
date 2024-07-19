const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createAllCategories,
} = require("../../controller/admin/category/categoryController");

const router = express.Router();

// Routes for categories
router.post("/createAllCategories", createAllCategories); // Create a new category
router.post("/category", createCategory); // Create a new category
router.get("/category", getAllCategories); // Get all categories
router.get("/category/:id", getCategoryById); // Get category by ID
router.put("/category/:id", updateCategory); // Update category by ID
router.delete("/category/:id", deleteCategory); // Delete category by ID

module.exports = router;
