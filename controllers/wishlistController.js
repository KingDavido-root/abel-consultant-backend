const Wishlist = require('../models/Wishlist');
const asyncHandler = require('express-async-handler');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate({
      path: 'items.product',
      select: 'title description price imageUrl'
    });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }

  res.json(wishlist);
});

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
exports.addToWishlist = asyncHandler(async (req, res) => {
  const { productId, productModel, price } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, items: [] });
  }

  // Check if item already exists in wishlist
  const existingItem = wishlist.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    res.status(400);
    throw new Error('Item already in wishlist');
  }

  wishlist.items.push({
    product: productId,
    productModel,
    price
  });

  await wishlist.save();

  // Populate product details before sending response
  await wishlist.populate({
    path: 'items.product',
    select: 'title description price imageUrl'
  });

  res.status(201).json(wishlist);
});

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  wishlist.items = wishlist.items.filter(
    item => item.product.toString() !== req.params.productId
  );

  await wishlist.save();

  // Populate product details before sending response
  await wishlist.populate({
    path: 'items.product',
    select: 'title description price imageUrl'
  });

  res.json(wishlist);
});

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  wishlist.items = [];
  await wishlist.save();

  res.json({ message: 'Wishlist cleared' });
});

// @desc    Move item to cart
// @route   POST /api/wishlist/:productId/move-to-cart
// @access  Private
exports.moveToCart = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error('Wishlist not found');
  }

  const item = wishlist.items.find(
    item => item.product.toString() === req.params.productId
  );

  if (!item) {
    res.status(404);
    throw new Error('Item not found in wishlist');
  }

  // Add to cart logic here (will need to implement cart functionality)
  // await Cart.addItem(req.user._id, item.product, 1);

  // Remove from wishlist
  wishlist.items = wishlist.items.filter(
    item => item.product.toString() !== req.params.productId
  );
  await wishlist.save();

  res.json({
    message: 'Item moved to cart',
    wishlist
  });
});

// @desc    Check if product is in wishlist
// @route   GET /api/wishlist/check/:productId
// @access  Private
exports.checkWishlistItem = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  const isInWishlist = wishlist?.items.some(
    item => item.product.toString() === req.params.productId
  );

  res.json({ isInWishlist });
});
