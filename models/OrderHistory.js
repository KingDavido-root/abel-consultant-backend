const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
  },
  note: {
    type: String,
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: false
  },
  estimatedDeliveryDate: {
    type: Date,
    required: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
orderHistorySchema.index({ order: 1, createdAt: -1 });

module.exports = mongoose.models.OrderHistory || mongoose.model('OrderHistory', orderHistorySchema);
