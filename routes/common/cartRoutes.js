const express = require("express");
const router = express.Router();
const {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../../controller/common/cart/userCartController");

// User routes
router.get("/", getUserCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear", clearCart);

module.exports = router;
