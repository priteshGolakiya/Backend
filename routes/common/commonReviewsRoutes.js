// routes/reviewRoutes.js
const express = require("express");
const {
  addReview,
  getReviews,

  getAllReviews,
} = require("../../controller/common/review/reviewController.js");
const checkToken = require("../../middleware/authToken.js");
const router = express.Router();

// getAllReviews
router.get("/reviews", getAllReviews);

// Create
router.post("/reviews", checkToken, addReview);

// Read
router.get("/reviews/:productId", getReviews);

module.exports = router;
