const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Ticket = require('../src/models/Ticket');

describe('Ticket Status Transitions', () => {
  let user;
  let ticket;

  beforeEach(async () => {
    user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      role: 'agent',
    });

    ticket = await Ticket.create({
      title: 'Test Ticket',
      description: 'Test description for status transitions',
      priority: 'Medium',
      status: 'Open',
      createdBy: user._id,
    });
  });

  describe('Valid transitions', () => {
    it('Open -> In Progress', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${ticket._id}/status`)
        .send({ status: 'In Progress' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('In Progress');
    });

    it('Open -> Cancelled', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${ticket._id}/status`)
        .send({ status: 'Cancelled' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('Cancelled');
    });

    it('In Progress -> Resolved', async () => {
      ticket.status = 'In Progress';
      await ticket.save();

      const res = await request(app)
        .patch(`/api/tickets/${ticket._id}/status`)
        .send({ status: 'Resolved' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('Resolved');
    });

    it('In Progress -> Cancelled', async () => {
      ticket.status = 'In Progress';
      await ticket.save();

      const res = await request(app)
        .patch(`/api/tickets/${ticket._id}/status`)
        .send({ status: 'Cancelled' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('Cancelled');
    });

    it('Resolved -> Closed', async () => {
      ticket.status = 'Resolved';
      await ticket.save();

      const res = await request(app)
        .patch(`/api/tickets/${ticket._id}/status`)
        .send({ status: 'Closed' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('Closed');
    });

    it('Same status is a no-op (allowed)', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${ticket._id}/status`)
        .send({ status: 'Open' });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('Open');
    });
  });

  describe('Invalid transitions', () => {
    it('Open -> Resolved (skip In Progress)', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${ticket._id}/status`)
        .send({ status: 'Resolved' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid status transition/);
    });

    it('Open -> Closed', async () => {
      const res = await request(app)
        .patch(`/api/tickets/${ticket._id}/status`)
        .send({ status: 'Closed' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('In Progress -> Open (backward)', async () => {
      ticket.status = 'In Progress';
      await ticket.save();

      const res = await request(app)
        .patch(`/api/tickets/${ticket._id}/status`)
        .send({ status: 'Open' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('Resolved -> In Progress (backward)', async () => {
      ticket.status = 'Resolved';
      await ticket.save();

      const res = await request(app)
        .patch(`/api/tickets/${ticket._id}/status`)
        .send({ status: 'In Progress' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('Closed -> any status (terminal state)', async () => {
      ticket.status = 'Closed';
      await ticket.save();

      const res = await request(app)
        .patch(`/api/tickets/${ticket._id}/status`)
        .send({ status: 'Open' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/terminal state/);
    });

    it('Cancelled -> any status (terminal state)', async () => {
      ticket.status = 'Cancelled';
      await ticket.save();

      const res = await request(app)
        .patch(`/api/tickets/${ticket._id}/status`)
        .send({ status: 'Open' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/terminal state/);
    });
  });

  describe('Ticket CRUD', () => {
    it('creates a ticket', async () => {
      const res = await request(app).post('/api/tickets').send({
        title: 'New Ticket',
        description: 'A new support ticket',
        priority: 'High',
        createdBy: user._id.toString(),
      });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('New Ticket');
      expect(res.body.data.status).toBe('Open');
    });

    it('lists tickets with status filter', async () => {
      await Ticket.create({
        title: 'Closed Ticket',
        description: 'Already closed',
        status: 'Closed',
        createdBy: user._id,
      });

      const res = await request(app).get('/api/tickets?status=Open');

      expect(res.status).toBe(200);
      expect(res.body.data.every((t) => t.status === 'Open')).toBe(true);
    });

    it('returns all tickets when status filter is empty', async () => {
      await Ticket.create({
        title: 'Closed Ticket',
        description: 'Already closed',
        status: 'Closed',
        createdBy: user._id,
      });

      const res = await request(app).get('/api/tickets?status=');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('searches tickets by keyword', async () => {
      const res = await request(app).get('/api/tickets?search=status');

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('returns 404 for non-existent ticket', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app).get(`/api/tickets/${fakeId}`);

      expect(res.status).toBe(404);
    });

    it('deletes a ticket', async () => {
      const res = await request(app).delete(`/api/tickets/${ticket._id}`);

      expect(res.status).toBe(200);
      const found = await Ticket.findById(ticket._id);
      expect(found).toBeNull();
    });
  });

  describe('Comments', () => {
    it('adds a comment to a ticket', async () => {
      const res = await request(app)
        .post(`/api/tickets/${ticket._id}/comments`)
        .send({
          message: 'This is a test comment',
          createdBy: user._id.toString(),
        });

      expect(res.status).toBe(201);
      expect(res.body.data.message).toBe('This is a test comment');
    });

    it('returns 404 when commenting on non-existent ticket', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const res = await request(app)
        .post(`/api/tickets/${fakeId}/comments`)
        .send({
          message: 'Comment on missing ticket',
          createdBy: user._id.toString(),
        });

      expect(res.status).toBe(404);
    });
  });
});
