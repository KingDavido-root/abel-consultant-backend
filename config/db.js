const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (error.message.includes('IP') || error.message.includes('not authorized')) {
      console.error('🚨 IP Address not whitelisted in MongoDB Atlas!');
      console.error('📝 Go to MongoDB Atlas > Network Access > Add IP Address > Allow Access from Anywhere (0.0.0.0/0)');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
