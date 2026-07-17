const mongoose = require('mongoose');
const { ALL_STATUSES } = require('../utils/statusTransitions');

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ALL_STATUSES,
      default: 'Open',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Created by is required'],
    },
  },
  { timestamps: true }
);

// Text index for keyword search on title and description
ticketSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Ticket', ticketSchema);
