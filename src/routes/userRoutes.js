import express from "express";
import {
  getProfile,
  updateProfile,
  getOrderHistory,
  createAddress,
  listAddresses,
  deleteAddress,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", isAuthenticated, getProfile);
router.put("/profile", isAuthenticated, updateProfile);
router.get("/orders", isAuthenticated, getOrderHistory);
router.get("/address", isAuthenticated, listAddresses);
router.post("/address", isAuthenticated, createAddress);
router.delete("/address/:id", isAuthenticated, deleteAddress);

export default router;
