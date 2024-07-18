import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts);
router.route("/:id").get(getProductById);
router.route("/").post(isAuthenticated, isAdmin, createProduct);
router.route("/:id").put(isAuthenticated, isAdmin, updateProduct);
router.route("/:id").delete(isAuthenticated, isAdmin, deleteProduct);
router.route("/:id/reviews").post(isAuthenticated, createProductReview);
router.route("/top").get(getTopProducts);

export default router;
