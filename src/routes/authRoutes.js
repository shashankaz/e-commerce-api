import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot-password", isAuthenticated, forgotPassword);
router.post("/reset-password", isAuthenticated, resetPassword);
router.get("/verify-email", isAuthenticated, verifyEmail);

export default router;
