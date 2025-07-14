const Order = require('../models/Order');

// Place new order
exports.placeOrder = async (req, res) => {
  try {
    const { productType, productId } = req.body;

    if (!productType || !productId) {
      return res.status(400).json({ message: 'productType and productId are required' });
    }

    const newOrder = new Order({
      user: req.user.id,
      productType,
      productId
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Place order error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get logged-in user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
