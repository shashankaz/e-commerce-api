import User from "../models/User.js";
import Product from "../models/Product.js";
import { handleErrors } from "../utils/helpers.js";

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist.product");

    if (user) {
      res.status(200).json({
        success: true,
        wishlist: user.wishlist,
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

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addItemToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user._id);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const itemIndex = user.wishlist.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    } else {
      user.wishlist.push({ product: productId });
    }

    await user.save();
    
    res.status(201).json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:itemId
// @access  Private
export const removeItemFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await user.save();
    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};
