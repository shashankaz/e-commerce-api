import express from "express";
import {
  addShippingAddress,
  getShippingOptions,
  getPaymentOptions,
  applyCoupon,
  getOrderSummary,
  placeOrder,
} from "../controllers/checkoutController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/address").post(isAuthenticated, addShippingAddress);
router.route("/shipping-options").get(isAuthenticated, getShippingOptions);
router.route("/payment-options").get(isAuthenticated, getPaymentOptions);
router.route("/apply-coupon").post(isAuthenticated, applyCoupon);
router.route("/order-summary").get(isAuthenticated, getOrderSummary);
router.route("/place-order").post(isAuthenticated, placeOrder);

export default router;
