const express = require('express');
const {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketStatus,
  deleteTicket,
} = require('../controllers/ticketController');
const validate = require('../middleware/validate');
const {
  createTicketRules,
  updateTicketRules,
  updateStatusRules,
  ticketQueryRules,
  objectIdParam,
} = require('../middleware/validators');

const router = express.Router();

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: List tickets with search and filter
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of tickets
 */
router.get('/', ticketQueryRules, validate, getTickets);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Tickets]
 */
router.get('/:id', objectIdParam('id'), validate, getTicketById);

router.post('/', createTicketRules, validate, createTicket);
router.put('/:id', updateTicketRules, validate, updateTicket);
router.patch('/:id/status', updateStatusRules, validate, updateTicketStatus);
router.delete('/:id', objectIdParam('id'), validate, deleteTicket);

module.exports = router;
