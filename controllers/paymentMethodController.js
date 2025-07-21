const PaymentMethod = require('../models/PaymentMethod');
const asyncHandler = require('express-async-handler');

// @desc    Get user payment methods
// @route   GET /api/payment-methods
// @access  Private
exports.getUserPaymentMethods = asyncHandler(async (req, res) => {
  const paymentMethods = await PaymentMethod.find({ user: req.user._id });
  res.json(paymentMethods);
});

// @desc    Add new payment method
// @route   POST /api/payment-methods
// @access  Private
exports.addPaymentMethod = asyncHandler(async (req, res) => {
  const { type, name, last4, expiryMonth, expiryYear, brand, accountNumber, routingNumber, bankName, isDefault } = req.body;

  const paymentMethod = await PaymentMethod.create({
    user: req.user._id,
    type,
    name,
    last4,
    expiryMonth,
    expiryYear,
    brand,
    accountNumber,
    routingNumber,
    bankName,
    isDefault
  });

  res.status(201).json(paymentMethod);
});

// @desc    Update payment method
// @route   PUT /api/payment-methods/:id
// @access  Private
exports.updatePaymentMethod = asyncHandler(async (req, res) => {
  const paymentMethod = await PaymentMethod.findById(req.params.id);

  if (!paymentMethod) {
    res.status(404);
    throw new Error('Payment method not found');
  }

  // Check ownership
  if (paymentMethod.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedPaymentMethod);
});

// @desc    Delete payment method
// @route   DELETE /api/payment-methods/:id
// @access  Private
exports.deletePaymentMethod = asyncHandler(async (req, res) => {
  const paymentMethod = await PaymentMethod.findById(req.params.id);

  if (!paymentMethod) {
    res.status(404);
    throw new Error('Payment method not found');
  }

  // Check ownership
  if (paymentMethod.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await paymentMethod.remove();
  res.json({ message: 'Payment method removed' });
});

// @desc    Set payment method as default
// @route   PUT /api/payment-methods/:id/default
// @access  Private
exports.setDefaultPaymentMethod = asyncHandler(async (req, res) => {
  const paymentMethod = await PaymentMethod.findById(req.params.id);

  if (!paymentMethod) {
    res.status(404);
    throw new Error('Payment method not found');
  }

  // Check ownership
  if (paymentMethod.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Remove default from all other payment methods
  await PaymentMethod.updateMany(
    { user: req.user._id },
    { $set: { isDefault: false } }
  );

  // Set this payment method as default
  paymentMethod.isDefault = true;
  await paymentMethod.save();

  res.json(paymentMethod);
});
