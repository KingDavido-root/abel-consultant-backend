require('dotenv').config();
const mongoose = require('mongoose');

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('\nDatabase Connection Info:');
    console.log('Database name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);

    // Check users
    const users = await mongoose.connection.db.collection('users').countDocuments();
    console.log('\nUsers count:', users);
    const sampleUser = await mongoose.connection.db.collection('users').findOne({});
    console.log('Sample user (without sensitive data):', {
      _id: sampleUser._id,
      name: sampleUser.name,
      email: sampleUser.email,
      role: sampleUser.role
    });

    // Check products
    const electronics = await mongoose.connection.db.collection('electronics').countDocuments();
    const cars = await mongoose.connection.db.collection('cars').countDocuments();
    const spareParts = await mongoose.connection.db.collection('spareparts').countDocuments();
    
    console.log('\nProduct counts:');
    console.log('Electronics:', electronics);
    console.log('Cars:', cars);
    console.log('Spare Parts:', spareParts);

    // Check orders
    const orders = await mongoose.connection.db.collection('orders').countDocuments();
    console.log('\nOrders count:', orders);
    const sampleOrder = await mongoose.connection.db.collection('orders').findOne({});
    if (sampleOrder) {
      console.log('Sample order:', {
        _id: sampleOrder._id,
        status: sampleOrder.status,
        totals: sampleOrder.totals
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkDatabase();
