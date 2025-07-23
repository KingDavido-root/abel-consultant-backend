const SellerProfile = require('../models/SellerProfile');
const ProductAnalytics = require('../models/ProductAnalytics');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Get or create seller profile
async function getOrCreateSellerProfile(userId) {
  let profile = await SellerProfile.findOne({ user: userId });
  if (!profile) {
    profile = new SellerProfile({
      user: userId,
      businessInfo: {
        name: 'New Seller'
      }
    });
    await profile.save();
  }
  return profile;
}

// Profile Management
exports.getProfile = async (req, res) => {
  try {
    const profile = await getOrCreateSellerProfile(req.user._id);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { businessInfo, settings } = req.body;
    const profile = await getOrCreateSellerProfile(req.user._id);

    if (businessInfo) {
      profile.businessInfo = {
        ...profile.businessInfo,
        ...businessInfo
      };
    }

    if (settings) {
      profile.settings = {
        ...profile.settings,
        ...settings
      };
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Pricing Rules
exports.addPricingRule = async (req, res) => {
  try {
    const { productType, productId, conditions } = req.body;
    const profile = await getOrCreateSellerProfile(req.user._id);

    profile.pricingRules.push({
      productType,
      productId,
      conditions,
      isActive: true
    });

    await profile.save();
    res.json(profile.pricingRules[profile.pricingRules.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding pricing rule', error: error.message });
  }
};

exports.updatePricingRule = async (req, res) => {
  try {
    const { ruleId, conditions, isActive } = req.body;
    const profile = await getOrCreateSellerProfile(req.user._id);

    const rule = profile.pricingRules.id(ruleId);
    if (!rule) {
      return res.status(404).json({ message: 'Pricing rule not found' });
    }

    if (conditions) rule.conditions = conditions;
    if (typeof isActive === 'boolean') rule.isActive = isActive;

    await profile.save();
    res.json(rule);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pricing rule', error: error.message });
  }
};

// Inventory Management
exports.addInventoryAlert = async (req, res) => {
  try {
    const { productType, productId, threshold, notificationType } = req.body;
    const profile = await getOrCreateSellerProfile(req.user._id);

    profile.inventoryAlerts.push({
      productType,
      productId,
      threshold,
      notificationType: notificationType || { email: true, dashboard: true }
    });

    await profile.save();
    res.json(profile.inventoryAlerts[profile.inventoryAlerts.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding inventory alert', error: error.message });
  }
};

// Analytics and Reports
exports.getAnalytics = async (req, res) => {
  try {
    const profile = await getOrCreateSellerProfile(req.user._id);
    const { timeframe } = req.query; // 'day', 'week', 'month', 'year'

    const startDate = new Date();
    switch (timeframe) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default: // day
        startDate.setDate(startDate.getDate() - 1);
    }

    // Get orders within timeframe
    const orders = await Order.find({
      seller: req.user._id,
      createdAt: { $gte: startDate }
    });

    // Get product analytics
    const productAnalytics = await ProductAnalytics.find({
      seller: req.user._id,
      'dailyMetrics.date': { $gte: startDate }
    });

    // Aggregate analytics
    const analytics = {
      sales: {
        total: orders.reduce((sum, order) => sum + order.totals.total, 0),
        count: orders.length
      },
      products: {
        viewed: productAnalytics.reduce((sum, pa) => 
          sum + pa.dailyMetrics.reduce((s, dm) => s + dm.views, 0), 0),
        purchased: productAnalytics.reduce((sum, pa) => 
          sum + pa.dailyMetrics.reduce((s, dm) => s + dm.purchased, 0), 0)
      },
      topProducts: productAnalytics
        .sort((a, b) => b.metrics.totalRevenue - a.metrics.totalRevenue)
        .slice(0, 10)
        .map(pa => ({
          productType: pa.productType,
          productId: pa.productId,
          revenue: pa.metrics.totalRevenue,
          views: pa.metrics.totalViews,
          purchases: pa.metrics.totalPurchases
        }))
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

// Product Performance
exports.getProductPerformance = async (req, res) => {
  try {
    const { productType, productId } = req.params;
    
    const analytics = await ProductAnalytics.findOne({
      seller: req.user._id,
      productType,
      productId
    });

    if (!analytics) {
      return res.status(404).json({ message: 'Product analytics not found' });
    }

    // Get related orders
    const orders = await Order.find({
      seller: req.user._id,
      'items.productId': productId
    })
    .sort({ createdAt: -1 })
    .limit(10);

    const performance = {
      metrics: analytics.metrics,
      dailyMetrics: analytics.dailyMetrics,
      priceHistory: analytics.priceHistory,
      stockHistory: analytics.stockHistory,
      relatedProducts: analytics.relatedProducts,
      recentOrders: orders.map(order => ({
        orderId: order._id,
        date: order.createdAt,
        quantity: order.items.find(item => item.productId === productId).quantity,
        total: order.totals.total
      }))
    };

    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product performance', error: error.message });
  }
};
