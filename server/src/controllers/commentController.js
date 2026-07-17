const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

/**
 * Add a comment to a ticket.
 */
const addComment = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { message, createdBy } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return next(new AppError('Ticket not found', 404));
    }

    const user = await User.findById(createdBy);
    if (!user) {
      return next(new AppError('User not found', 404));
    }

    const comment = await Comment.create({ ticketId, message, createdBy });

    const populated = await Comment.findById(comment._id).populate(
      'createdBy',
      'name email role'
    );

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all comments for a ticket.
 */
const getComments = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return next(new AppError('Ticket not found', 404));
    }

    const comments = await Comment.find({ ticketId })
      .populate('createdBy', 'name email role')
      .sort({ createdAt: 1 });

    res.json({ success: true, data: comments });
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getComments };
