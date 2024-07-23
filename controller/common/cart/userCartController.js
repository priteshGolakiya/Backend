const Cart = require("../../../models/cartModel");
const Product = require("../../../models/productModel");

const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate(
      "items.product"
    );
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

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      cart = new Cart({ user: req.userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: Number(product.price),
      });
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + (Number(item.price) || 0) * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding item to cart", error: error.message });
  }
};
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cartItem.quantity = quantity;
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating cart item", error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({
      message: "Error removing item from cart",
      error: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};

module.exports = {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
