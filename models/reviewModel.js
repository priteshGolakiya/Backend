// models/Review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, required: true },
  date: { type: Date, default: Date.now },
  // userName: { type: String },
  // email: { type: String },
});

module.exports = mongoose.model("Review", reviewSchema);
