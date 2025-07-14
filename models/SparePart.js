const mongoose = require('mongoose');

const sparePartSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  stock: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.SparePart || mongoose.model('SparePart', sparePartSchema);
