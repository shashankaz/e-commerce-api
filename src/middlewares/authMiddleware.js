import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { handleErrors } from "../utils/helpers.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Login First",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    handleErrors(res, error);
  }
};

const adminEmail = process.env.ADMIN_USER;
const adminPassword = process.env.ADMIN_PASS;

export const isAdmin = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Login First",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (req.user.email !== adminEmail || req.user.password !== adminPassword) {
      return res.status(403).json({
        success: false,
        message: "Access denied, admin only",
      });
    }

    next();
  } catch (error) {
    handleErrors(res, error);
  }
};
