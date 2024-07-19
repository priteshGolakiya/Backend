const express = require("express");
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
} = require("../../controller/common/order/userOrderController");

router.post("/create", createOrder);
router.get("/", getUserOrders);
router.get("/:orderId", getOrderDetails);
router.post("/:orderId/cancel", cancelOrder);
module.exports = router;
