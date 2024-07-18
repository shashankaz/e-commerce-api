import User from "../models/User.js";
import Order from "../models/Order.js";
import bcrypt from "bcrypt";
import { handleErrors } from "../utils/helpers.js";

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        success: true,
        id: user._id,
        name: user.name,
        email: user.email,
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
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

// @desc    Get user order history
// @route   GET /api/users/orders
// @access  Private
export const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    if (orders.length > 0) {
      res.status(200).json({
        success: true,
        orders,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Create a new address
// @route   POST /api/users/address
// @access  Private
export const createAddress = async (req, res) => {
  const { street, city, state, zip, country } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const newAddress = {
        street,
        city,
        state,
        zip,
        country,
      };

      user.addresses.push(newAddress);

      const updatedUser = await user.save();

      res.status(201).json({
        success: true,
        id: updatedUser._id,
        addresses: updatedUser.addresses,
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

// @desc    List all addresses
// @route   GET /api/users/address
// @access  Private
export const listAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");

    if (user) {
      res.status(200).json({
        success: true,
        id: user._id,
        addresses: user.addresses,
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

// @desc    Delete an address
// @route   DELETE /api/users/address/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.addresses = user.addresses.filter(
        (address) => address._id.toString() !== id
      );

      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        id: updatedUser._id,
        addresses: updatedUser.addresses,
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
