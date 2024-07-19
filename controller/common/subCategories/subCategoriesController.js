const asyncHandler = require("express-async-handler");
const Category = require("../../../models/categoryModel");
const Subcategory = require("../../../models/subCategoryModel");
const Product = require("../../../models/productModel");

// Get all subcategories
const getAllSubcategories = asyncHandler(async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate("category");
    const subcategoriesWithProducts = [];

    for (let subcategory of subcategories) {
      const products = await Product.find({ subcategory: subcategory._id })
        .populate({
          path: "reviews",
          populate: {
            path: "user",
            select: "email userName",
          },
        })
        .lean();

      const productsMapped = products.map((product) => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images.slice(0, 3),
        averageRating:
          product.reviews.length > 0
            ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
              product.reviews.length
            : 0,
        numberOfRatings: product.reviews.length,
        reviews: product.reviews,
      }));

      const subcategoryWithProducts = {
        _id: subcategory._id,
        name: subcategory.name,
        brand: subcategory.brand,
        category: subcategory.category,
        products: productsMapped,
      };

      subcategoriesWithProducts.push(subcategoryWithProducts);
    }

    res.status(200).json({
      error: false,
      success: true,
      subcategories: subcategoriesWithProducts,
    });
  } catch (err) {
    res.status(500).json({ error: true, success: false, error: err.message });
  }
});

// Get subcategory by ID
const getSubcategoryById = asyncHandler(async (req, res) => {
  try {
    const subcategoryId = req.params.id;
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

    const products = await Product.find({ subcategory: subcategoryId })
      .populate({
        path: "reviews",
        populate: {
          path: "user",
          select: "email userName",
        },
      })
      .lean();

    const productsMapped = products.map((product) => ({
      _id: product._id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      discountPrice: product.discountPrice,
      category: product.category,
      images: product.images.slice(0, 3),
      averageRating:
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
            product.reviews.length
          : 0,
      numberOfRatings: product.reviews.length,
      reviews: product.reviews,
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

module.exports = {
  getAllSubcategories,
  getSubcategoryById,
};
