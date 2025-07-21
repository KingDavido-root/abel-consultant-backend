const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleById
} = require('../controllers/vehicleController');

router.use(protect);

router.route('/')
  .get(getUserVehicles)
  .post(addVehicle);

router.route('/:id')
  .get(getVehicleById)
  .put(updateVehicle)
  .delete(deleteVehicle);

module.exports = router;
