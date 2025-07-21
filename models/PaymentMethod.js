const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['card', 'bank'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  // For credit cards
  last4: {
    type: String,
    required: function() {
      return this.type === 'card';
    }
  },
  expiryMonth: {
    type: String,
    required: function() {
      return this.type === 'card';
    }
  },
  expiryYear: {
    type: String,
    required: function() {
      return this.type === 'card';
    }
  },
  brand: {
    type: String,
    required: function() {
      return this.type === 'card';
    }
  },
  // For bank accounts
  accountNumber: {
    type: String,
    required: function() {
      return this.type === 'bank';
    }
  },
  routingNumber: {
    type: String,
    required: function() {
      return this.type === 'bank';
    }
  },
  bankName: {
    type: String,
    required: function() {
      return this.type === 'bank';
    }
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Ensure only one default payment method per user
paymentMethodSchema.pre('save', async function(next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

module.exports = mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', paymentMethodSchema);
