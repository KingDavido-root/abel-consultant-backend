const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addPricingRule,
  updatePricingRule,
  addInventoryAlert,
  getAnalytics,
  getProductPerformance
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// All routes require authentication and admin role
router.use(protect);
router.use(role(['admin']));

// Dashboard and Analytics
router.get('/dashboard', getAnalytics);
router.get('/products/:productType/:productId/performance', getProductPerformance);

// Inventory Management
router.post('/inventory-alerts', addInventoryAlert);

// Pricing Management
router.post('/pricing-rules', addPricingRule);
router.put('/pricing-rules/:ruleId', updatePricingRule);

// Profile and Settings
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
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
