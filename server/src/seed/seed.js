require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');

const seedUsers = [
  { name: 'Alice Admin', email: 'alice@stms.com', role: 'admin' },
  { name: 'Bob Agent', email: 'bob@stms.com', role: 'agent' },
  { name: 'Carol Agent', email: 'carol@stms.com', role: 'agent' },
  { name: 'Dave User', email: 'dave@stms.com', role: 'user' },
  { name: 'Eve User', email: 'eve@stms.com', role: 'user' },
];

const seed = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Promise.all([
      Comment.deleteMany({}),
      Ticket.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create users
    const users = await User.insertMany(seedUsers);
    console.log(`Seeded ${users.length} users`);

    const [alice, bob, carol, dave, eve] = users;

    // Create tickets
    const tickets = await Ticket.insertMany([
      {
        title: 'Cannot login to dashboard',
        description:
          'User reports being unable to login after password reset. Error message says "Invalid credentials" even with correct password.',
        priority: 'High',
        status: 'Open',
        createdBy: dave._id,
        assignedTo: bob._id,
      },
      {
        title: 'Email notifications not working',
        description:
          'Ticket assignment emails are not being delivered to agents. SMTP configuration may need review.',
        priority: 'Critical',
        status: 'In Progress',
        createdBy: eve._id,
        assignedTo: carol._id,
      },
      {
        title: 'Feature request: Dark mode',
        description:
          'Multiple users have requested a dark mode theme for the application dashboard.',
        priority: 'Low',
        status: 'Open',
        createdBy: dave._id,
        assignedTo: null,
      },
      {
        title: 'Slow page load on reports',
        description:
          'The reports page takes over 10 seconds to load when filtering by date range.',
        priority: 'Medium',
        status: 'Resolved',
        createdBy: eve._id,
        assignedTo: bob._id,
      },
      {
        title: 'Export to CSV broken',
        description:
          'Clicking Export CSV on the tickets list downloads an empty file.',
        priority: 'High',
        status: 'Closed',
        createdBy: dave._id,
        assignedTo: carol._id,
      },
      {
        title: 'Duplicate ticket creation',
        description:
          'Submitting the create ticket form twice quickly creates duplicate tickets.',
        priority: 'Medium',
        status: 'Cancelled',
        createdBy: alice._id,
        assignedTo: null,
      },
    ]);
    console.log(`Seeded ${tickets.length} tickets`);

    // Create comments
    const comments = await Comment.insertMany([
      {
        ticketId: tickets[0]._id,
        message: 'I have verified the issue. Checking authentication service logs.',
        createdBy: bob._id,
      },
      {
        ticketId: tickets[0]._id,
        message: 'This started happening after the last deployment on Monday.',
        createdBy: dave._id,
      },
      {
        ticketId: tickets[1]._id,
        message: 'SMTP credentials were rotated last week. Updating configuration now.',
        createdBy: carol._id,
      },
      {
        ticketId: tickets[3]._id,
        message: 'Added database indexes on the date range columns. Load time reduced to 2s.',
        createdBy: bob._id,
      },
    ]);
    console.log(`Seeded ${comments.length} comments`);

    console.log('\nSeed completed successfully!');
    console.log('Sample user IDs for frontend:');
    users.forEach((u) => console.log(`  ${u.name}: ${u._id}`));
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
