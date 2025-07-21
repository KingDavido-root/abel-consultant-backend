const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserAppointments,
  getAvailableTimeSlots,
  bookAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointmentDetails
} = require('../controllers/serviceAppointmentController');

router.use(protect);

router.route('/')
  .get(getUserAppointments)
  .post(bookAppointment);

router.get('/available-slots', getAvailableTimeSlots);

router.route('/:id')
  .get(getAppointmentDetails)
  .put(updateAppointment);

router.put('/:id/cancel', cancelAppointment);

module.exports = router;
