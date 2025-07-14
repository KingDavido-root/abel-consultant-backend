const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  stock: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.models.Car || mongoose.model('Car', carSchema);
