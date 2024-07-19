// adminCartController.js

const Cart = require("../../../models/cartModel");
const User = require("../../../models/userModel");
const Product = require("../../../models/productModel");

const getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find().populate("user").populate("items.product");
    res.status(200).json(carts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching carts", error: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id)
      .populate("user")
      .populate("items.product");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { items, totalPrice },
      { new: true, runValidators: true }
    )
      .populate("user")
      .populate("items.product");

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating cart", error: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting cart", error: error.message });
  }
};

const getCartStats = async (req, res) => {
  try {
    const totalCarts = await Cart.countDocuments();
    const averageCartValue = await Cart.aggregate([
      { $group: { _id: null, avgValue: { $avg: "$totalPrice" } } },
    ]);

    res.status(200).json({
      totalCarts,
      averageCartValue: averageCartValue[0]?.avgValue || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching cart statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCarts,
  getCartById,
  updateCart,
  deleteCart,
  getCartStats,
};
