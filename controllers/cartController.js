const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// Utility function to validate product
async function validateProduct(productType, productId) {
  const model = productType === 'electronic' ? 'Electronic' :
               productType === 'car' ? 'Vehicle' : 'SparePart';
  const Product = mongoose.model(model);
  return await Product.findById(productId);
}

// Utility function to cleanup expired carts
async function cleanupExpiredCarts() {
  const expiryTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
  await Cart.deleteMany({
    updatedAt: { $lt: expiryTime }
  });
}

// Add item to cart
exports.addItemToCart = async (req, res) => {
  try {
    const { productId, name, price, quantity } = req.body;
    const user = req.user._id;

    let cart = await Cart.findOne({ user });

    if (!cart) {
      cart = new Cart({ user, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);

    if (itemIndex > -1) {
      const item = cart.items[itemIndex];
      item.quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error: error.message });
  }
};

// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user._id;

    let cart = await Cart.findOne({ user });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId !== productId);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
};

// Get cart
exports.getCart = async (req, res) => {
  try {
    const user = req.user._id;

    const cart = await Cart.findOne({ user });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

// Update item quantity
exports.updateItemQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = req.user._id;

    let cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Validate product and stock
    const product = await validateProduct(cart.items[itemIndex].productType, productId);
    if (!product) {
      return res.status(404).json({ message: 'Product no longer exists' });
    }

    if (quantity > product.stockQuantity) {
      return res.status(400).json({ 
        message: 'Requested quantity exceeds available stock',
        availableStock: product.stockQuantity
      });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].lastUpdated = new Date();
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item quantity', error: error.message });
  }
};

// Save cart for later
exports.saveForLater = async (req, res) => {
  try {
    const user = req.user._id;
    const cart = await Cart.findOne({ user });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Validate all items in cart
    for (let item of cart.items) {
      const product = await validateProduct(item.productType, item.productId);
      if (!product || product.stockQuantity < item.quantity) {
        return res.status(400).json({
          message: `Product ${item.name} is no longer available in requested quantity`,
          productId: item.productId,
          requestedQuantity: item.quantity,
          availableQuantity: product ? product.stockQuantity : 0
        });
      }
    }

    // Update timestamps
    cart.items.forEach(item => {
      item.lastUpdated = new Date();
    });

    await cart.save();
    res.status(200).json({
      message: 'Cart saved successfully',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving cart', error: error.message });
  }
};

// Get cart summary
exports.getCartSummary = async (req, res) => {
  try {
    const user = req.user._id;
    const cart = await Cart.findOne({ user });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const summary = {
      totalItems: cart.items.length,
      totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: cart.totals.subtotal,
      tax: cart.totals.tax,
      total: cart.totals.total,
      itemTypes: {
        electronic: cart.items.filter(item => item.productType === 'electronic').length,
        car: cart.items.filter(item => item.productType === 'car').length,
        sparepart: cart.items.filter(item => item.productType === 'sparepart').length
      },
      lastUpdated: cart.updatedAt
    };

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart summary', error: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const user = req.user._id;

    let cart = await Cart.findOne({ user });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};

