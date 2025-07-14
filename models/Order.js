const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productType: { type: String, required: true, enum: ['electronic', 'car', 'sparepart'] },
  productId: { type: String, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
