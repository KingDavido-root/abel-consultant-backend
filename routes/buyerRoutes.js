const express = require('express');
const router = express.Router();
const {
  getProfile,
  updatePreferences,
  createShoppingList,
  addToShoppingList,
  addReview,
  addToRecentlyViewed,
  getRecommendations
} = require('../controllers/buyerController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Profile management
router.get('/profile', getProfile);
router.put('/preferences', updatePreferences);

// Shopping lists
router.post('/shopping-lists', createShoppingList);
router.post('/shopping-lists/:listId/items', addToShoppingList);

// Reviews
router.post('/reviews', addReview);

// Recently viewed
router.post('/recently-viewed', addToRecentlyViewed);

// Recommendations
router.get('/recommendations', getRecommendations);

module.exports = router;
