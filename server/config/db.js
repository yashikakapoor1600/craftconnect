// server/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // .env file ke variables ko load karne ke liye

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongodb !');
  } catch (err) {
    console.error('connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;