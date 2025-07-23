const UserProfile = require('../models/UserProfile');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Get or create user profile
async function getOrCreateProfile(userId) {
  let profile = await UserProfile.findOne({ user: userId });
  if (!profile) {
    profile = new UserProfile({ user: userId });
    await profile.save();
  }
  return profile;
}

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { emailNotifications, currency, language } = req.body;
    const profile = await getOrCreateProfile(req.user._id);

    if (emailNotifications) {
      profile.preferences.emailNotifications = {
        ...profile.preferences.emailNotifications,
        ...emailNotifications
      };
    }
    if (currency) profile.preferences.currency = currency;
    if (language) profile.preferences.language = language;

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating preferences', error: error.message });
  }
};

// Shopping Lists
exports.createShoppingList = async (req, res) => {
  try {
    const { name, isPublic } = req.body;
    const profile = await getOrCreateProfile(req.user._id);

    profile.shoppingLists.push({
      name,
      isPublic: isPublic || false,
      items: []
    });

    await profile.save();
    res.json(profile.shoppingLists[profile.shoppingLists.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Error creating shopping list', error: error.message });
  }
};

exports.addToShoppingList = async (req, res) => {
  try {
    const { listId, productType, productId } = req.body;
    const profile = await getOrCreateProfile(req.user._id);

    const list = profile.shoppingLists.id(listId);
    if (!list) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }

    list.items.push({ productType, productId });
    await profile.save();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to shopping list', error: error.message });
  }
};

// Reviews
exports.addReview = async (req, res) => {
  try {
    const { productType, productId, rating, comment, images } = req.body;
    const profile = await getOrCreateProfile(req.user._id);

    // Check if user has purchased the product
    const hasPurchased = await Order.exists({
      user: req.user._id,
      'items.productType': productType,
      'items.productId': productId,
      status: 'Delivered'
    });

    if (!hasPurchased) {
      return res.status(403).json({ message: 'Can only review purchased products' });
    }

    // Check if user has already reviewed this product
    const existingReview = profile.reviews.find(
      r => r.productType === productType && r.productId === productId
    );

    if (existingReview) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    profile.reviews.push({
      productType,
      productId,
      rating,
      comment,
      images: images || []
    });

    await profile.save();
    res.json(profile.reviews[profile.reviews.length - 1]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

// Recently Viewed
exports.addToRecentlyViewed = async (req, res) => {
  try {
    const { productType, productId } = req.body;
    const profile = await getOrCreateProfile(req.user._id);

    // Remove if already exists and add to front
    profile.recentlyViewed = profile.recentlyViewed.filter(
      item => !(item.productType === productType && item.productId === productId)
    );

    profile.recentlyViewed.unshift({
      productType,
      productId,
      viewedAt: new Date()
    });

    // Keep only last 50 items
    if (profile.recentlyViewed.length > 50) {
      profile.recentlyViewed = profile.recentlyViewed.slice(0, 50);
    }

    await profile.save();
    res.json(profile.recentlyViewed);
  } catch (error) {
    res.status(500).json({ message: 'Error updating recently viewed', error: error.message });
  }
};

// Get personalized recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.user._id);
    
    // Get recent purchases
    const recentOrders = await Order.find({
      user: req.user._id,
      status: 'Delivered'
    })
    .sort({ createdAt: -1 })
    .limit(10);

    // Get recently viewed items
    const recentlyViewed = profile.recentlyViewed.slice(0, 10);

    // Combine and analyze preferences
    const preferences = {
      productTypes: {},
      categories: new Set()
    };

    // Analyze orders
    recentOrders.forEach(order => {
      order.items.forEach(item => {
        preferences.productTypes[item.productType] = 
          (preferences.productTypes[item.productType] || 0) + 1;
      });
    });

    // Analyze viewed items
    recentlyViewed.forEach(item => {
      preferences.productTypes[item.productType] = 
        (preferences.productTypes[item.productType] || 0) + 1;
    });

    // Generate recommendations (you'll need to implement this based on your product models)
    // This is a placeholder for the recommendation logic
    const recommendations = {
      basedOnHistory: [],
      popular: [],
      similar: []
    };

    res.json({
      recommendations,
      preferences
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating recommendations', error: error.message });
  }
};
