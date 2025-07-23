const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  preferences: {
    emailNotifications: {
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: true }
    },
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' }
  },
  shoppingLists: [{
    name: { type: String, required: true },
    items: [{
      productType: { type: String, required: true },
      productId: { type: String, required: true },
      addedAt: { type: Date, default: Date.now }
    }],
    isPublic: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  recentlyViewed: [{
    productType: { type: String, required: true },
    productId: { type: String, required: true },
    viewedAt: { type: Date, default: Date.now }
  }],
  reviews: [{
    productType: { type: String, required: true },
    productId: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    images: [String],
    createdAt: { type: Date, default: Date.now },
    helpful: { type: Number, default: 0 }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
userProfileSchema.index({ 'user': 1 });
userProfileSchema.index({ 'reviews.productId': 1 });
userProfileSchema.index({ 'recentlyViewed.viewedAt': -1 });

module.exports = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);
