import express from "express";
import {
  addReview,
  getReviewsForProduct,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(isAuthenticated, addReview);

router.route("/:productId").get(getReviewsForProduct);

router
  .route("/:reviewId")
  .put(isAuthenticated, updateReview)
  .delete(isAuthenticated, deleteReview);

export default router;
