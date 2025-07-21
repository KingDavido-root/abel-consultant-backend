const Address = require('../models/Address');
const asyncHandler = require('express-async-handler');

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
exports.getUserAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.find({ user: req.user._id });
  res.json(addresses);
});

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
exports.addAddress = asyncHandler(async (req, res) => {
  const { type, street, city, state, zip, country, isDefault } = req.body;

  const address = await Address.create({
    user: req.user._id,
    type,
    street,
    city,
    state,
    zip,
    country,
    isDefault
  });

  res.status(201).json(address);
});

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
exports.updateAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  // Check ownership
  if (address.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedAddress = await Address.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedAddress);
});

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  // Check ownership
  if (address.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await address.remove();
  res.json({ message: 'Address removed' });
});

// @desc    Set address as default
// @route   PUT /api/addresses/:id/default
// @access  Private
exports.setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findById(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  // Check ownership
  if (address.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Remove default from all other addresses
  await Address.updateMany(
    { user: req.user._id },
    { $set: { isDefault: false } }
  );

  // Set this address as default
  address.isDefault = true;
  await address.save();

  res.json(address);
});
