import express from "express";
import { getNotifications } from "../controllers/notificationController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getNotifications);

export default router;
