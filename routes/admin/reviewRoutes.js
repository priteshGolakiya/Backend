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
router.get("/", getAllReviews);

// Create
router.post("/", addReview);

// Read
router.get("/:productId", getReviews);

// Update
router.put("/:reviewId", updateReview);

// Delete
router.delete("/:reviewId", deleteReview);

module.exports = router;
