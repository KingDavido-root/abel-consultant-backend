const ServiceAppointment = require('../models/ServiceAppointment');
const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');

// @desc    Get user appointments
// @route   GET /api/appointments
// @access  Private
exports.getUserAppointments = asyncHandler(async (req, res) => {
  const appointments = await ServiceAppointment.find({ user: req.user._id })
    .populate('technician', 'name')
    .populate('location')
    .populate('paymentMethod');
  res.json(appointments);
});

// @desc    Get available time slots
// @route   GET /api/appointments/available-slots
// @access  Private
exports.getAvailableTimeSlots = asyncHandler(async (req, res) => {
  const { date, duration } = req.query;
  if (!date || !duration) {
    res.status(400);
    throw new Error('Please provide date and duration');
  }

  const slots = await ServiceAppointment.getAvailableTimeSlots(new Date(date), parseInt(duration));
  res.json(slots);
});

// @desc    Book new appointment
// @route   POST /api/appointments
// @access  Private
exports.bookAppointment = asyncHandler(async (req, res) => {
  const {
    service,
    date,
    time,
    duration,
    notes,
    price,
    vehicle,
    location,
    paymentMethod,
    serviceType
  } = req.body;

  // Check if time slot is available
  const isAvailable = await ServiceAppointment.isTimeSlotAvailable(new Date(date), time, duration);
  if (!isAvailable) {
    res.status(400);
    throw new Error('Selected time slot is not available');
  }

  const appointment = await ServiceAppointment.create({
    user: req.user._id,
    service,
    date,
    time,
    duration,
    notes,
    price,
    vehicle,
    location,
    paymentMethod,
    serviceType
  });

  // Create notification for user
  await Notification.createNotification({
    user: req.user._id,
    title: 'Appointment Booked',
    message: `Your ${service} appointment has been scheduled for ${new Date(date).toLocaleDateString()} at ${time}`,
    type: 'appointment',
    priority: 'medium',
    relatedModel: 'ServiceAppointment',
    relatedId: appointment._id
  });

  res.status(201).json(appointment);
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await ServiceAppointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check ownership
  if (appointment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // If changing date/time, check availability
  if (req.body.date || req.body.time) {
    const isAvailable = await ServiceAppointment.isTimeSlotAvailable(
      new Date(req.body.date || appointment.date),
      req.body.time || appointment.time,
      req.body.duration || appointment.duration
    );
    if (!isAvailable) {
      res.status(400);
      throw new Error('Selected time slot is not available');
    }
  }

  const updatedAppointment = await ServiceAppointment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  // Create notification for update
  await Notification.createNotification({
    user: req.user._id,
    title: 'Appointment Updated',
    message: `Your appointment for ${updatedAppointment.service} has been updated`,
    type: 'appointment',
    priority: 'medium',
    relatedModel: 'ServiceAppointment',
    relatedId: updatedAppointment._id
  });

  res.json(updatedAppointment);
});

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
exports.cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await ServiceAppointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check ownership
  if (appointment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  appointment.status = 'Cancelled';
  await appointment.save();

  // Create notification for cancellation
  await Notification.createNotification({
    user: req.user._id,
    title: 'Appointment Cancelled',
    message: `Your appointment for ${appointment.service} has been cancelled`,
    type: 'appointment',
    priority: 'high',
    relatedModel: 'ServiceAppointment',
    relatedId: appointment._id
  });

  res.json(appointment);
});

// @desc    Get appointment details
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointmentDetails = asyncHandler(async (req, res) => {
  const appointment = await ServiceAppointment.findById(req.params.id)
    .populate('technician', 'name')
    .populate('location')
    .populate('paymentMethod');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check ownership
  if (appointment.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(appointment);
});
