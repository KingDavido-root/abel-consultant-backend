const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'items.productModel',
      required: true
    },
    productModel: {
      type: String,
      required: true,
      enum: ['Car', 'Electronic', 'SparePart']
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    price: {
      type: Number,
      required: true
    },
    inStock: {
      type: Boolean,
      default: true
    }
  }]
}, { timestamps: true });

// Index for efficient queries
wishlistSchema.index({ user: 1 });
wishlistSchema.index({ 'items.product': 1 });

// Method to add item to wishlist
wishlistSchema.methods.addItem = async function(productId, productModel, price) {
  const existingItem = this.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (!existingItem) {
    this.items.push({
      product: productId,
      productModel,
      price
    });
    await this.save();
  }
  return this;
};

// Method to remove item from wishlist
wishlistSchema.methods.removeItem = async function(productId) {
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );
  await this.save();
  return this;
};

// Method to check if product is in wishlist
wishlistSchema.methods.hasItem = function(productId) {
  return this.items.some(
    item => item.product.toString() === productId.toString()
  );
};

// Method to get wishlist items count
wishlistSchema.methods.getItemsCount = function() {
  return this.items.length;
};

// Static method to get or create wishlist for user
wishlistSchema.statics.getOrCreateWishlist = async function(userId) {
  let wishlist = await this.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await this.create({ user: userId, items: [] });
  }
  return wishlist;
};

module.exports = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
