// controllers/userOrderController.js
const Order = require("../../../models/orderModel");
const Cart = require("../../../models/cartModel");
const Address = require("../../../models/addressModel");
const Product = require("../../../models/productModel");

const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItems, shippingAddressId, totalAmount, quantity } = req.body;

    const address = await Address.findOne({
      _id: shippingAddressId,
      user: userId,
    });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Validate and process order items
    const orderItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${item.product}`);
        }
        return {
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress: address._id,
      totalAmount,
      status: "pending",
    });

    await order.save();

    await Promise.all(
      orderItems.map(async (item) => {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      })
    );

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error in createOrder:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ user: userId })
      .populate("orderItems.product")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.userId;

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate("orderItems.product")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order details", error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.userId;

    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    order.status = "cancelled";
    order.updatedAt = Date.now();
    await order.save();

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling order", error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
};
