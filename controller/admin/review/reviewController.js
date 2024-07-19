// routes/reviewRoutes.js
const Review = require("../../../models/reviewModel");
const Product = require("../../../models/productModel");
const User = require("../../../models/userModel");

// Add a review to a product
const addReview = async (req, res) => {
  const { userId, productId, rating, review } = req.body;

  try {
    // Check if the user has already reviewed the product
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "User has already reviewed this product." });
    }

    // Create a new review
    const newReview = new Review({
      user: userId,
      product: productId,
      rating,
      review,
    });

    await newReview.save();

    // Update the product's average rating
    const product = await Product.findById(productId).populate("reviews");
    const averageRating = product.averageRating;

    res
      .status(201)
      .json({ message: "Review added successfully", averageRating });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all reviews for a specific product with user and product details
const getReviews = async (req, res) => {
  const productId = req.params.productId;
  try {
    const reviews = await Review.find({ product: productId }).populate([
      {
        path: "user",
        model: User,
        select: "_id username email", // Specify the fields you want to retrieve from the user
      },
      {
        path: "product",
        model: Product,
        select: "_id name", // Specify the fields you want to retrieve from the product
      },
    ]);
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a review
const updateReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const { rating, review } = req.body;
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, review },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Review updated successfully", updatedReview });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  try {
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all reviews for all products with user and product details
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate([
      {
        path: "user",
        model: User,
        select: "_id username email", // Specify the fields you want to retrieve from the user
      },
      {
        path: "product",
        model: Product,
        select: "_id name", // Specify the fields you want to retrieve from the product
      },
    ]);
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};



module.exports = {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
  getAllReviews,
  
};
