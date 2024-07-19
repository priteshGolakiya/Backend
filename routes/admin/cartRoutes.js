const express = require("express");
const router = express.Router();
const {
  getAllCarts,
  getCartById,
  updateCart,
  deleteCart,
  getCartStats,
} = require("../../controller/admin/cart/adminCartController");

router.get("/", getAllCarts);
router.get("/:id", getCartById);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);
router.get("/stats", getCartStats);

module.exports = router;
