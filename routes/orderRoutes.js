const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { validateOrder } = require('../middleware/validation');

// User places new order
router.post('/', protect, validateOrder, createOrder);

// User gets their own orders
router.get('/my', protect, getUserOrders);

// Admin updates order status
router.put('/:id', protect, role(['admin']), updateOrderStatus);

// Cancel order
router.post('/:id/cancel', protect, cancelOrder);

module.exports = router;
