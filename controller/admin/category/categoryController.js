const asyncHandler = require("express-async-handler");
const Category = require("../../../models/categoryModel");
const Subcategory = require("../../../models/subCategoryModel");
const Product = require("../../../models/productModel");

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Category already exists",
      });
    }

    // Create and save the new category
    const newCategory = new Category({ name });
    await newCategory.save();

    // Send success response
    res.status(201).json({
      error: false,
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (err) {
    // Send error response
    res.status(500).json({
      error: true,
      success: false,
      error: err.message,
    });
  }
});

// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find().populate("subcategories");
    res.status(200).json({ error: false, success: true, categories });
  } catch (err) {
    res.status(500).json({ error: true, success: false, error: err.message });
  }
});

// Get category by ID
const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "subcategories"
    );
    if (!category) {
      return res
        .status(404)
        .json({ error: true, success: false, message: "Category not found" });
    }
    res.status(200).json({ error: false, success: true, category });
  } catch (err) {
    res.status(500).json({ error: true, success: false, error: err.message });
  }
});

// Update category by ID
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!category) {
      return res
        .status(404)
        .json({ error: true, success: false, message: "Category not found" });
    }
    res.status(200).json({
      error: false,
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (err) {
    res.status(500).json({ error: true, success: false, error: err.message });
  }
});

// Delete category by ID
const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ error: true, success: false, message: "Category not found" });
    }

    // Delete all subcategories related to this category
    await Subcategory.deleteMany({ category: req.params.id });

    // Delete all Product related to this category
    await Product.deleteMany({ category: req.params.id });

    // Delete the category
    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      error: false,
      success: true,
      message: "Category and related subcategories deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: true, success: false, error: err.message });
  }
});

const createAllCategories = asyncHandler(async (req, res) => {
  try {
    const { categoryNames } = req.body;

    if (!categoryNames || !Array.isArray(categoryNames)) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "categoryNames should be an array of category names",
      });
    }

    const existingCategories = await Category.find({
      name: { $in: categoryNames },
    });
    if (existingCategories.length === categoryNames.length) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "All categories already exist",
      });
    }

    const categoriesToCreate = categoryNames.filter(
      (name) => !existingCategories.find((cat) => cat.name === name)
    );
    const createdCategories = await Category.insertMany(
      categoriesToCreate.map((name) => ({ name }))
    );

    res.status(201).json({
      error: false,
      success: true,
      message: "Categories created successfully",
      categories: createdCategories,
    });
  } catch (err) {
    res.status(500).json({ error: true, success: false, message: err.message });
  }
});

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createAllCategories,
};
