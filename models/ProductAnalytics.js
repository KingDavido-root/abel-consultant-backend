const mongoose = require('mongoose');

const dailyMetricsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  views: { type: Number, default: 0 },
  addedToCart: { type: Number, default: 0 },
  purchased: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 }
});

const productAnalyticsSchema = new mongoose.Schema({
  productType: { type: String, required: true },
  productId: { type: String, required: true },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metrics: {
    totalViews: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 }
  },
  dailyMetrics: [dailyMetricsSchema],
  priceHistory: [{
    price: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  stockHistory: [{
    quantity: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  relatedProducts: [{
    productType: String,
    productId: String,
    correlationStrength: Number
  }],
  searchTerms: [{
    term: String,
    count: Number
  }]
}, {
  timestamps: true
});

// Indexes for efficient queries
productAnalyticsSchema.index({ productType: 1, productId: 1 });
productAnalyticsSchema.index({ seller: 1 });
productAnalyticsSchema.index({ 'dailyMetrics.date': -1 });
productAnalyticsSchema.index({ 'metrics.totalRevenue': -1 });

module.exports = mongoose.models.ProductAnalytics || mongoose.model('ProductAnalytics', productAnalyticsSchema);
