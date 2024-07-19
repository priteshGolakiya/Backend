const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  updateOrderStatus,
  getOrderDetails,
  getOrderStats,
} = require("../../controller/admin/order/orderController");
const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

router.use(adminAuthMiddleware);

router.get("/", getAllOrders);
router.get("/stats", getOrderStats);
router.get("/:orderId", getOrderDetails);
router.post("/:orderId/status", updateOrderStatus);

module.exports = router;
