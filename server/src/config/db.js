const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the URI from environment variables.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected successfully');
};

module.exports = connectDB;
