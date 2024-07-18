import User from "../models/User.js";
import Product from "../models/Product.js";
import { handleErrors } from "../utils/helpers.js";

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");

    if (user) {
      res.status(200).json({
        success: true,
        cart: user.cart,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user._id);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    
    res.status(201).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeItemFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await user.save();
    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { quantity } = req.body;

    const user = await User.findById(req.user._id);

    const itemIndex = user.cart.findIndex(
      (item) => item._id.toString() === req.params.itemId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = quantity;

      await user.save();

      res.status(200).json({
        success: true,
        cart: user.cart,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = [];

    await user.save();

    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};
