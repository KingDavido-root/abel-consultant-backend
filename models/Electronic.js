const mongoose = require('mongoose');

const electronicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  stock: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.Electronic || mongoose.model('Electronic', electronicSchema);
