import express from "express";
import {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  getCart,
  clearCart,
} from "../controllers/cartController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getCart);
router.route("/").post(isAuthenticated, addItemToCart);
router.route("/").delete(isAuthenticated, clearCart);
router.route("/:itemId").delete(isAuthenticated, removeItemFromCart);
router.route("/:itemId").put(isAuthenticated, updateCartItemQuantity);

export default router;
