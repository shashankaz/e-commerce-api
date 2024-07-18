import User from "../models/User.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { generateToken, handleErrors } from "../utils/helpers.js";

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const verifyToken = generateToken(user._id);

    const verifyUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/verify-email?token=${verifyToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });

    const mailOptions = {
      from: "noreply@ecommerce.com",
      to: user.email,
      subject: "Email Verification",
      text: `Please verify your email by clicking the link: \n\n ${verifyUrl}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Verification email could not be sent",
        });
      } else {
        res.status(201).json({
          success: true,
          message: "User registered successfully. Please verify your email.",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      }
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (matchPassword) {
      if (!user.isVerified) {
        return res.status(401).json({
          success: false,
          message: "Email not verified",
        });
      }

      res.status(201).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Logout user
// @route   GET /api/auth/logout
// @access  Private
export const logout = (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resetToken = generateToken(user._id);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER,
        pass: process.env.ETHEREAL_PASS,
      },
    });

    const mailOptions = {
      from: "noreply@ecommerce.com",
      to: user.email,
      subject: "Password Reset",
      text: `You requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Email could not be sent",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Email sent",
          info,
        });
      }
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token or token has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    handleErrors(res, error);
  }
};
