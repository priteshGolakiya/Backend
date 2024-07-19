const asyncHandler = require("express-async-handler");
const Category = require("../../../models/categoryModel");
const Subcategory = require("../../../models/subCategoryModel");
const Product = require("../../../models/productModel");

// Get all categories with subcategories and products
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("subcategory");
    res.status(200).json({ error: false, success: true, products });
  } catch (err) {
    res.status(500).json({ error: true, success: false, message: err.message });
  }
});

// Get category by ID with subcategories and products
const getCategoryById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Category not found",
      });
    }

    const subcategories = await Subcategory.find({ category: id });

    const subcategoryIds = subcategories.map((sub) => sub._id);

    const products = await Product.find({
      subcategory: { $in: subcategoryIds },
    }).select("name images subcategory finalPrice");

    if (products.length === 0) {
      const allProducts = await Product.find().select(
        "name images subcategory finalPrice"
      );
    }

    const formattedCategory = {
      _id: category._id,
      name: category.name,
      subcategories: await Promise.all(
        subcategories.map(async (subcategory) => {
          const subcategoryProducts = products.filter(
            (product) =>
              product.subcategory &&
              product.subcategory.toString() === subcategory._id.toString()
          );

          // If no products found, try direct query
          if (subcategoryProducts.length === 0) {
            const directProducts = await Product.find({
              subcategory: subcategory._id,
            }).select("name images subcategory finalPrice");

            subcategoryProducts.push(...directProducts);
          }

          return {
            _id: subcategory._id,
            name: subcategory.name,
            products: subcategoryProducts.map((product) => ({
              _id: product._id,
              name: product.name,
              image: product.images.length > 0 ? product.images[0] : null,
              finalPrice: product.finalPrice,
            })),
          };
        })
      ),
    };

    res.status(200).json({
      error: false,
      success: true,
      category: formattedCategory,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      error: true,
      success: false,
      message: err.message,
    });
  }
});
module.exports = {
  getAllCategories,
  getCategoryById,
};
