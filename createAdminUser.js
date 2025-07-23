require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'david.mwamba@ictc.ch' });
    if (existingAdmin) {
      console.log('Admin user already exists:', {
        name: existingAdmin.name,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
      return;
    }

    const admin = new User({
      name: 'David Mwamba',
      email: 'david.mwamba@ictc.ch',
      password: 'Network25!#',
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully:', {
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdminUser();
