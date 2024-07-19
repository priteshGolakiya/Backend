const asyncHandler = require("express-async-handler");
const Category = require("../../../models/categoryModel");
const Subcategory = require("../../../models/subCategoryModel");
const Product = require("../../../models/productModel");

// Create a new subcategory under a category
const createSubcategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    // Check if the subcategory already exists
    const existingSubcategory = await Subcategory.findOne({ name });
    if (existingSubcategory) {
      return res.status(400).json({ message: "Subcategory already exists" });
    }

    // Create and save the new subcategory
    const subcategory = new Subcategory({ name, category: categoryId });
    await subcategory.save();

    // Update the parent category to include the new subcategory
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { $push: { subcategories: subcategory._id } },
      { new: true }
    );

    // Send success response
    res.status(201).json({
      error: false,
      success: true,
      message: "Subcategory created successfully",
      subcategory,
      category,
    });
  } catch (err) {
    // Send error response
    res.status(500).json({ error: true, success: false, message: err.message });
  }
});

// Get all subcategories
const getAllSubcategories = asyncHandler(async (req, res) => {
  try {
    // Fetch all subcategories and populate their 'category' field
    const subcategories = await Subcategory.find().populate("category");

    // Prepare an array to store subcategories with products and images
    const subcategoriesWithProducts = [];

    // Loop through each subcategory to fetch related products and format the response
    for (let i = 0; i < subcategories.length; i++) {
      const subcategory = subcategories[i];

      // Fetch products related to this subcategory
      const products = await Product.find({ subcategory: subcategory._id });

      // Map products to include only necessary details (like name, price, images)
      const productsMapped = products.map((product) => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        images: product.images.slice(0, 3), // Adjust number of images as needed
      }));

      // Create an object with subcategory details and related products
      const subcategoryWithProducts = {
        _id: subcategory._id,
        name: subcategory.name,
        category: subcategory.category,
        products: productsMapped,
      };

      // Push the formatted subcategory object to the array
      subcategoriesWithProducts.push(subcategoryWithProducts);
    }

    // Return the array of subcategories with related products and images
    res.status(200).json({
      error: false,
      success: true,
      subcategories: subcategoriesWithProducts,
    });
  } catch (err) {
    // Handle any errors that occur during the query or population
    res.status(500).json({ error: true, success: false, error: err.message });
  }
});

// Get subcategory by ID
const getSubcategoryById = asyncHandler(async (req, res) => {
  try {
    const subcategoryId = req.params.id;

    // Fetch the subcategory and populate its 'category' field
    const subcategory = await Subcategory.findById(subcategoryId).populate(
      "category"
    );

    if (!subcategory) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Subcategory not found",
      });
    }

    // Fetch products related to this subcategory
    const products = await Product.find({ subcategory: subcategoryId });

    // Map products to include only necessary details (like name, price, images)
    const productsMapped = products.map((product) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images.slice(0, 3), // Adjust number of images as needed
    }));

    res.status(200).json({
      error: false,
      success: true,
      subcategory,
      products: productsMapped,
    });
  } catch (err) {
    res.status(500).json({ error: true, success: false, error: err.message });
  }
});

// Update subcategory by ID
const updateSubcategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const subcategory = await Subcategory.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!subcategory) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Subcategory not found",
      });
    }
    res.status(200).json({
      error: false,
      success: true,
      message: "Subcategory updated successfully",
      subcategory,
    });
  } catch (err) {
    res.status(500).json({ error: true, success: false, error: err.message });
  }
});

// Delete subcategory by ID
const deleteSubcategory = asyncHandler(async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Subcategory not found",
      });
    }
    res.status(200).json({
      error: false,
      success: true,
      message: "Subcategory deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: true, success: false, error: err.message });
  }
});

const createAllSubcategories = asyncHandler(async (req, res) => {
  try {
    const { categoryId, names } = req.body;

    // Check if the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: true, success: false, message: "Category not found" });
    }

    // Prepare an array to store created subcategories
    const createdSubcategories = [];

    // Iterate through each name and create a subcategory
    for (let i = 0; i < names.length; i++) {
      const name = names[i];

      // Check if the subcategory already exists
      const existingSubcategory = await Subcategory.findOne({ name, category: categoryId });
      if (existingSubcategory) {
        continue; // Skip creation if subcategory already exists
      }

      // Create and save the new subcategory
      const subcategory = new Subcategory({ name, category: categoryId });
      await subcategory.save();

      // Update the parent category to include the new subcategory
      category.subcategories.push(subcategory._id);
      await category.save();

      // Push the created subcategory to the response array
      createdSubcategories.push(subcategory);
    }

    // Send success response
    res.status(201).json({
      error: false,
      success: true,
      message: "Subcategories created successfully",
      subcategories: createdSubcategories,
    });
  } catch (err) {
    // Send error response
    res.status(500).json({ error: true, success: false, message: err.message });
  }
});


module.exports = {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
  createAllSubcategories,
};
