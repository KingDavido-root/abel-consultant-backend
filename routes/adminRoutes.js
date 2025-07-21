const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { 
  getDashboardStats,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllProducts,
  getAllOrders
} = require('../controllers/adminController');

// All routes are protected and require admin role
router.use(protect, role(['admin']));

// Dashboard statistics
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Product management (comprehensive list across all categories)
router.get('/products', getAllProducts);

// Order management
router.get('/orders', getAllOrders);

module.exports = router;
