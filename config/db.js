const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (error.message.includes('IP')) {
      console.error('IP Address not whitelisted. Please add your IP to MongoDB Atlas Network Access.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
