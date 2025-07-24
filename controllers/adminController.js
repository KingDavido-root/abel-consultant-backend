const User = require('../models/User');
const Order = require('../models/Order');
const ProductAnalytics = require('../models/ProductAnalytics');
const mongoose = require('mongoose');
const Electronic = require('../models/Electronic');
const Car = require('../models/Car');
const SparePart = require('../models/SparePart');

exports.getDashboardStats = async (req, res) => {
  try {
    const [userCount, orderCount, electronicCount, carCount, sparePartCount] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Electronic.countDocuments(),
      Car.countDocuments(),
      SparePart.countDocuments()
    ]);

    // Calculate revenue
    const revenue = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totals.total' } } }
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.json({
      stats: {
        users: userCount,
        orders: orderCount,
        products: {
          total: electronicCount + carCount + sparePartCount,
          electronics: electronicCount,
          cars: carCount,
          spareParts: sparePartCount
        },
        revenue: revenue[0]?.total || 0
      },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const [electronics, cars, spareParts] = await Promise.all([
      Electronic.find().sort({ createdAt: -1 }),
      Car.find().sort({ createdAt: -1 }),
      SparePart.find().sort({ createdAt: -1 })
    ]);

    res.json({
      electronics,
      cars,
      spareParts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

