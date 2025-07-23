const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
  productType: { type: String, required: true },
  productId: { type: String, required: true },
  conditions: [{
    type: { 
      type: String, 
      enum: ['time', 'stock', 'competition', 'demand'],
      required: true 
    },
    operator: { 
      type: String, 
      enum: ['>', '<', '>=', '<=', '='],
      required: true 
    },
    value: { type: Number, required: true },
    adjustment: {
      type: { type: String, enum: ['percentage', 'fixed'], required: true },
      value: { type: Number, required: true }
    }
  }],
  isActive: { type: Boolean, default: true }
});

const inventoryAlertSchema = new mongoose.Schema({
  productType: { type: String, required: true },
  productId: { type: String, required: true },
  threshold: { type: Number, required: true },
  notificationType: {
    email: { type: Boolean, default: true },
    dashboard: { type: Boolean, default: true }
  }
});

const sellerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessInfo: {
    name: { type: String, required: true },
    description: String,
    logo: String,
    contact: {
      email: String,
      phone: String,
      address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
      }
    }
  },
  settings: {
    autoAcceptOrders: { type: Boolean, default: false },
    defaultHandlingTime: { type: Number, default: 1 }, // in days
    minimumOrderValue: { type: Number, default: 0 },
    automaticInventorySync: { type: Boolean, default: true },
    automaticPriceAdjustment: { type: Boolean, default: false }
  },
  metrics: {
    totalOrders: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  pricingRules: [pricingRuleSchema],
  inventoryAlerts: [inventoryAlertSchema],
  analytics: {
    visitorsCount: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    topSellingProducts: [{
      productType: String,
      productId: String,
      quantity: Number,
      revenue: Number
    }]
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
sellerProfileSchema.index({ 'user': 1 });
sellerProfileSchema.index({ 'businessInfo.name': 1 });
sellerProfileSchema.index({ 'pricingRules.productId': 1 });
sellerProfileSchema.index({ 'inventoryAlerts.productId': 1 });

module.exports = mongoose.models.SellerProfile || mongoose.model('SellerProfile', sellerProfileSchema);
