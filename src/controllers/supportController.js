import SupportTicket from "../models/SupportTicket.js";
import { handleErrors } from "../utils/helpers.js";

// @desc    Create a new support ticket
// @route   POST /api/support
// @access  Private
export const createSupportTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const supportTicket = new SupportTicket({
      user: req.user._id,
      subject,
      message,
    });

    const createdTicket = await supportTicket.save();
    res.status(201).json({
      success: true,
      ticket: createdTicket,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Get all support tickets for a user
// @route   GET /api/support
// @access  Private
export const getSupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id });

    if (tickets.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No support tickets found",
      });
    }

    res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Update a support ticket
// @route   PUT /api/support/:ticketId
// @access  Private
export const updateSupportTicket = async (req, res) => {
  try {
    const { status, response } = req.body;

    const ticket = await SupportTicket.findById(req.params.ticketId);

    if (ticket) {
      ticket.status = status || ticket.status;
      ticket.response = response || ticket.response;

      const updatedTicket = await ticket.save();
      res.json({
        success: true,
        ticket: updatedTicket,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};

// @desc    Delete a support ticket
// @route   DELETE /api/support/:ticketId
// @access  Private
export const deleteSupportTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.ticketId);

    if (ticket) {
      await ticket.remove();
      res.json({
        success: true,
        message: "Support ticket deleted",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Support ticket not found",
      });
    }
  } catch (error) {
    handleErrors(res, error);
  }
};
