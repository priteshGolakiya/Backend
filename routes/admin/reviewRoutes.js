// routes/reviewRoutes.js
const express = require("express");
const {
  addReview,
  getReviews,
  updateReview,
  deleteReview,
  getAllReviews,
} = require("../../controller/admin/review/reviewController");
const router = express.Router();

// getAllReviews
router.get("/reviews", getAllReviews);

// Create
router.post("/reviews", addReview);

// Read
router.get("/reviews/:productId", getReviews);

// Update
router.put("/reviews/:reviewId", updateReview);

// Delete
router.delete("/reviews/:reviewId", deleteReview);

module.exports = router;
