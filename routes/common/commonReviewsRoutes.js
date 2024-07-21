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
router.get("/", getAllReviews);

// Create
router.post("/", checkToken, addReview);

// Read
router.get("/:productId", getReviews);

module.exports = router;
