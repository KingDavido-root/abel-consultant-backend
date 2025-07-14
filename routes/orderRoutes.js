const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// User places new order
router.post('/', auth, placeOrder);

// User gets their own orders
router.get('/my', auth, getMyOrders);

// Admin updates order status
router.put('/:id', auth, role(['admin']), updateOrderStatus);

module.exports = router;
