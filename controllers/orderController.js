const Order = require('../models/Order');
const User = require('../models/User');           // To get user email
const sendEmail = require('../utils/sendEmail');  // Email helper

// Place new order
exports.placeOrder = async (req, res) => {
  try {
    const { productType, productId } = req.body;

    if (!productType || !productId) {
      return res.status(400).json({ message: 'productType and productId are required' });
    }

    // Create order linked to logged-in user
    const newOrder = new Order({
      user: req.user.id,
      productType,
      productId
    });

    await newOrder.save();

    // Fetch user details for email
    const user = await User.findById(req.user.id);

    // Send order confirmation email
    await sendEmail({
      to: user.email,
      subject: 'Order Confirmation',
      text: `Your order for product ${productId} has been placed!`,
      html: `
        <p>Hi ${user.name || ''},</p>
        <p>Your order for <strong>${productType}</strong> (Product ID: <strong>${productId}</strong>) has been placed successfully.</p>
        <p>Thank you for choosing Abel Consultant LLC!</p>
      `
    });

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

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Optionally, notify user about status change:
    const user = await User.findById(order.user);
    await sendEmail({
      to: user.email,
      subject: 'Order Status Updated',
      text: `Your order status has been updated to: ${status}`,
      html: `<p>Hi ${user.name || ''},</p>
             <p>Your order status is now: <strong>${status}</strong>.</p>`
    });

    res.json(order);
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
