const Vehicle = require('../models/Vehicle');
const asyncHandler = require('express-async-handler');

// @desc    Get user vehicles
// @route   GET /api/vehicles
// @access  Private
exports.getUserVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ user: req.user._id });
  res.json(vehicles);
});

// @desc    Add new vehicle
// @route   POST /api/vehicles
// @access  Private
exports.addVehicle = asyncHandler(async (req, res) => {
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  console.log('User from request:', req.user);
  console.log('Authorization header:', req.headers.authorization);

  if (!req.user) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  if (!req.user._id) {
    console.log('User object structure:', JSON.stringify(req.user, null, 2));
    res.status(401);
    throw new Error('User ID not found in token');
  }
  const {
    make,
    model,
    year,
    vin,
    licensePlate,
    color,
    mileage,
    lastService,
    notes
  } = req.body;

  // Check if VIN already exists (if provided)
  if (vin) {
    const existingVehicle = await Vehicle.findOne({ vin });
    if (existingVehicle) {
      res.status(400);
      throw new Error('Vehicle with this VIN already exists');
    }
  }

  // Log the user ID we're about to use
  console.log('Creating vehicle with user ID:', req.user._id);

  const vehicleData = {
    user: req.user._id,
    make,
    model,
    year,
    vin,
    licensePlate,
    color,
    mileage,
    lastService,
    notes
  };

  // Log the complete vehicle data
  console.log('Vehicle data to be created:', vehicleData);

  const vehicle = await Vehicle.create(vehicleData);

  // Log the created vehicle
  console.log('Created vehicle:', vehicle);

  res.status(201).json(vehicle);
});

// @desc    Update vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
exports.updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  // Check ownership
  if (vehicle.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // If VIN is being changed, check if new VIN already exists
  if (req.body.vin && req.body.vin !== vehicle.vin) {
    const existingVehicle = await Vehicle.findOne({ vin: req.body.vin });
    if (existingVehicle) {
      res.status(400);
      throw new Error('Vehicle with this VIN already exists');
    }
  }

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedVehicle);
});

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
exports.deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  // Check ownership
  if (vehicle.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await vehicle.remove();
  res.json({ message: 'Vehicle removed' });
});

// @desc    Get vehicle by ID
// @route   GET /api/vehicles/:id
// @access  Private
exports.getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  // Check ownership
  if (vehicle.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(vehicle);
});
