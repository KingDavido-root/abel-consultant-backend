const express = require('express');
const router = express.Router();
const { 
  addItemToCart, 
  removeItemFromCart, 
  getCart, 
  clearCart,
  getCartSummary,
  updateItemQuantity,
  saveForLater
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes require authentication
router.use(protect);

// Get user's cart
router.get('/', getCart);

// Get cart summary
router.get('/summary', getCartSummary);

// Add item to cart
router.post('/add', addItemToCart);

// Remove item from cart
router.post('/remove', removeItemFromCart);

// Update item quantity
router.put('/update-quantity', updateItemQuantity);

// Save cart for later
router.post('/save', saveForLater);

// Clear cart
router.delete('/clear', clearCart);

module.exports = router;
