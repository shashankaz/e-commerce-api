import Order from "../models/Order.js";
import User from "../models/User.js";
import Coupon from "../models/Coupon.js";
import Stripe from "stripe";
import { handleErrors } from "../utils/helpers.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Select or Add a new shipping address
// @route   POST /api/checkout/address
// @access  Private
export const addShippingAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { street, city, state, zip, country } = req.body;

    const newAddress = {
      street,
      city,
      state,
      zip,
      country,
    };

    user.shippingAddress = newAddress;

    await user.save();

    res.status(201).json({
      success: true,
      address: newAddress,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Get shipping options
// @route   GET /api/checkout/shipping-options
// @access  Private
export const getShippingOptions = async (req, res) => {
  try {
    const shippingOptions = [
      { id: 1, name: "Standard Shipping", price: 5.0, duration: "5-7 days" },
      { id: 2, name: "Express Shipping", price: 15.0, duration: "2-3 days" },
      { id: 3, name: "Next-Day Shipping", price: 25.0, duration: "1 day" },
    ];

    res.status(200).json({
      success: true,
      shippingOptions,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Get payment options
// @route   GET /api/checkout/payment-options
// @access  Private
export const getPaymentOptions = async (req, res) => {
  try {
    const paymentOptions = [
      { id: 1, name: "Credit/Debit Card" },
      { id: 2, name: "PayPal" },
    ];

    res.status(200).json({
      success: true,
      paymentOptions,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Apply a coupon
// @route   POST /api/checkout/apply-coupon
// @access  Private
export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      discount: coupon.discount,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Get order summary
// @route   GET /api/checkout/order-summary
// @access  Private
export const getOrderSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const items = user.cart.map((item) => ({
      name: item.product.name,
      qty: item.quantity,
      price: item.product.price,
      total: item.quantity * item.product.price,
    }));

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);

    res.status(200).json({
      success: true,
      items,
      subtotal,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Place an order
// @route   POST /api/checkout/place-order
// @access  Private
export const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, items, totalPrice } = req.body;

    const user = await User.findById(req.user._id);

    const newOrder = new Order({
      user: user._id,
      orderItems: items,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: false,
      isDelivered: false,
    });

    const createdOrder = await newOrder.save();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(201).json({
      success: true,
      order: createdOrder,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};
