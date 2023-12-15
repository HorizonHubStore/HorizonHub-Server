// src/config/db.ts
import mongoose from 'mongoose';
const { mongoURI } = require('../config/keys');
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error: ', err);
    process.exit(1);
  }
};

export default connectDB;
