const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  // Existing fields
  productType: { 
    type: String, 
    required: true, 
    enum: ['electronic', 'car', 'sparepart'] 
  },
  productId: { 
    type: String, 
    required: true,
    validate: {
      validator: async function(v) {
        // Validate product exists based on type
        const model = this.productType === 'electronic' ? 'Electronic' :
                     this.productType === 'car' ? 'Vehicle' : 'SparePart';
        const Product = mongoose.model(model);
        const exists = await Product.exists({ _id: v });
        return exists;
      },
      message: 'Product does not exist'
    }
  },
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price cannot be negative'] 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: [1, 'Quantity must be at least 1'],
    validate: {
      validator: async function(v) {
        // Check stock availability
        const model = this.productType === 'electronic' ? 'Electronic' :
                     this.productType === 'car' ? 'Vehicle' : 'SparePart';
        const Product = mongoose.model(model);
        const product = await Product.findById(this.productId);
        return product && product.stockQuantity >= v;
      },
      message: 'Requested quantity exceeds available stock'
    }
  },
  variant: {
    id: String,
    name: String,
    price: Number
  },
  image: String,
  addedAt: { 
    type: Date, 
    default: Date.now 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
  productType: { 
    type: String, 
    required: true, 
    enum: ['electronic', 'car', 'sparepart'] 
  },
  productId: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  variant: {
    id: String,
    name: String,
    price: Number
  },
  image: String
});

const cartSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totals: {
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  const cart = this;
  
  // Calculate subtotal
  cart.totals.subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Calculate tax (assuming 10% tax rate)
  cart.totals.tax = cart.totals.subtotal * 0.1;

  // Calculate total
  cart.totals.total = cart.totals.subtotal + cart.totals.tax;

  next();
});

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
