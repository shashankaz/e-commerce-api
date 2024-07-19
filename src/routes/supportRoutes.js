import express from "express";
import {
  createSupportTicket,
  getSupportTickets,
  updateSupportTicket,
  deleteSupportTicket,
} from "../controllers/supportController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(isAuthenticated, getSupportTickets);
router.route("/").post(isAuthenticated, createSupportTicket);
router.route("/:ticketId").put(isAuthenticated, isAdmin, updateSupportTicket);
router
  .route("/:ticketId")
  .delete(isAuthenticated, isAdmin, deleteSupportTicket);

export default router;
