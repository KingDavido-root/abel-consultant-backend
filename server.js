const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Make sure you have db.js

dotenv.config();
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://abel-consultant-frontend-git-main-david-mwambas-projects.vercel.app',
        'https://abel-consultant-frontend.vercel.app'
      ]
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/buyer', require('./routes/buyerRoutes'));
app.use('/api/library', require('./routes/libraryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); // Admin panel routes

// New feature routes
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/payment-methods', require('./routes/paymentMethodRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/electronics', require('./routes/electronicsRoutes'));
app.use('/api/spare-parts', require('./routes/sparePartsRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
