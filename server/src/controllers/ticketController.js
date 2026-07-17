const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const {
  isValidTransition,
  getTransitionErrorMessage,
} = require('../utils/statusTransitions');

/**
 * Get all tickets with optional search and status filter.
 */
const getTickets = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [tickets, total] = await Promise.all([
      Ticket.find(filter)
        .populate('createdBy', 'name email role')
        .populate('assignedTo', 'name email role')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Ticket.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: tickets,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single ticket by ID with its comments.
 */
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    if (!ticket) {
      return next(new AppError('Ticket not found', 404));
    }

    const comments = await Comment.find({ ticketId: ticket._id })
      .populate('createdBy', 'name email role')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: { ticket, comments },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new ticket.
 */
const createTicket = async (req, res, next) => {
  try {
    const { title, description, priority, status, assignedTo, createdBy } = req.body;

    const creator = await User.findById(createdBy);
    if (!creator) {
      return next(new AppError('Creator user not found', 404));
    }

    if (assignedTo) {
      const assignee = await User.findById(assignedTo);
      if (!assignee) {
        return next(new AppError('Assigned user not found', 404));
      }
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      status: status || 'Open',
      assignedTo: assignedTo || null,
      createdBy,
    });

    const populated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * Update ticket fields (excluding status — use updateTicketStatus for that).
 */
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return next(new AppError('Ticket not found', 404));
    }

    const { title, description, priority, assignedTo } = req.body;

    // Prevent status changes through this endpoint
    if (req.body.status && req.body.status !== ticket.status) {
      return next(
        new AppError('Use PATCH /api/tickets/:id/status to change ticket status', 400)
      );
    }

    if (assignedTo) {
      const assignee = await User.findById(assignedTo);
      if (!assignee) {
        return next(new AppError('Assigned user not found', 404));
      }
    }

    if (title !== undefined) ticket.title = title;
    if (description !== undefined) ticket.description = description;
    if (priority !== undefined) ticket.priority = priority;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;

    await ticket.save();

    const populated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * Update ticket status with transition validation.
 */
const updateTicketStatus = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return next(new AppError('Ticket not found', 404));
    }

    const { status: newStatus } = req.body;

    if (!isValidTransition(ticket.status, newStatus)) {
      return next(
        new AppError(getTransitionErrorMessage(ticket.status, newStatus), 400)
      );
    }

    ticket.status = newStatus;
    await ticket.save();

    const populated = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a ticket and its comments.
 */
const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return next(new AppError('Ticket not found', 404));
    }

    await Comment.deleteMany({ ticketId: ticket._id });
    await ticket.deleteOne();

    res.json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketStatus,
  deleteTicket,
};
