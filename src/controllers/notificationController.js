import Notification from "../models/Notification.js";
import { handleErrors } from "../utils/helpers.js";

// @desc    Get all unread notifications for a user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};
