const express = require('express');
const router = express.Router();
const { 
  addElectronic, 
  getElectronics, 
  addCar, 
  getCars, 
  addSparePart, 
  getSpareParts 
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { validateProduct } = require('../middleware/validation');

// Public routes - Get products
router.get('/electronics', getElectronics);
router.get('/cars', getCars);
router.get('/spare-parts', getSpareParts);

// Admin only - Add products
router.post('/electronics', protect, role(['admin']), validateProduct, addElectronic);
router.post('/cars', protect, role(['admin']), validateProduct, addCar);
router.post('/spare-parts', protect, role(['admin']), validateProduct, addSparePart);

module.exports = router;
