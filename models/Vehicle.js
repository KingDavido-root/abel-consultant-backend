const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  make: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  vin: {
    type: String,
    unique: true,
    sparse: true  // Makes the unique index sparse, allowing multiple null values
  },
  licensePlate: {
    type: String
  },
  color: {
    type: String
  },
  mileage: {
    type: Number
  },
  lastService: {
    type: Date
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
