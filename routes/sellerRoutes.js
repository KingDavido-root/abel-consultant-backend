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
} = require('../controllers/sellerController');
const { protect } = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// All routes require authentication and seller role
router.use(protect);
router.use(role(['seller', 'admin']));

// Profile management
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Pricing rules
router.post('/pricing-rules', addPricingRule);
router.put('/pricing-rules/:ruleId', updatePricingRule);

// Inventory management
router.post('/inventory-alerts', addInventoryAlert);

// Analytics and reports
router.get('/analytics', getAnalytics);
router.get('/products/:productType/:productId/performance', getProductPerformance);

module.exports = router;
