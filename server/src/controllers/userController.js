const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

/**
 * Get all users (seed data only — no auth).
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('name email role').sort({ name: 1 });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single user by ID.
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name email role');
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUserById };
