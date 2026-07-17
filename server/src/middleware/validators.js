const { body, param, query } = require('express-validator');
const { ALL_STATUSES } = require('../utils/statusTransitions');

const objectIdParam = (name) =>
  param(name).isMongoId().withMessage(`Invalid ${name}`);

const createTicketRules = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority'),
  body('status').optional().isIn(ALL_STATUSES).withMessage('Invalid status'),
  body('assignedTo').optional({ nullable: true }).isMongoId().withMessage('Invalid assignedTo'),
  body('createdBy').isMongoId().withMessage('Valid createdBy is required'),
];

const updateTicketRules = [
  objectIdParam('id'),
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid priority'),
  body('status').optional().isIn(ALL_STATUSES).withMessage('Invalid status'),
  body('assignedTo').optional({ nullable: true }).isMongoId().withMessage('Invalid assignedTo'),
];

const updateStatusRules = [
  objectIdParam('id'),
  body('status').isIn(ALL_STATUSES).withMessage('Invalid status'),
];

const ticketQueryRules = [
  query('status')
    .optional({ checkFalsy: true })
    .isIn(ALL_STATUSES)
    .withMessage('Invalid status filter'),
  query('search')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage('Search query too long'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];

const createCommentRules = [
  objectIdParam('ticketId'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
  body('createdBy').isMongoId().withMessage('Valid createdBy is required'),
];

module.exports = {
  createTicketRules,
  updateTicketRules,
  updateStatusRules,
  ticketQueryRules,
  createCommentRules,
  objectIdParam,
};
