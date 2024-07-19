const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "Apparel & Accessories",
        "Electronics",
        "Home & Garden",
        "Health & Beauty",
        "Toys & Games",
        "Books & Media",
        "Baby & Kids",
        "Office Supplies",
        "Travel & Luggage",
        "Fitness & Wellness",
        "Home Improvement",
        "Electronics Accessories",
        "Music & Instruments",
      ],
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
