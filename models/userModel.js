const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "Email already in use."],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePic: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual field to reference addresses
userSchema.virtual("addresses", {
  ref: "Address",
  localField: "_id",
  foreignField: "user",
  justOne: false,
  options: { lean: true },
});

module.exports = mongoose.model("User", userSchema);
