const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  updateOrderStatus,
  getOrderDetails,
  getOrderStats,
  deleteOrder,
} = require("../../controller/admin/order/orderController");
const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

router.use(adminAuthMiddleware);

router.get("/", getAllOrders);
router.get("/stats", getOrderStats);
router.get("/:orderId", getOrderDetails);
router.post("/:orderId/status", updateOrderStatus);
router.delete("/:orderId", deleteOrder);

module.exports = router;
