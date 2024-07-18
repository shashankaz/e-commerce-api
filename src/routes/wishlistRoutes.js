import express from "express";
import {
  addItemToWishlist,
  removeItemFromWishlist,
  getWishlist,
} from "../controllers/wishlistController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getWishlist);
router.route("/").post(isAuthenticated, addItemToWishlist);
router.route("/:itemId").delete(isAuthenticated, removeItemFromWishlist);

export default router;
