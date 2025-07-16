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
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { validateProduct } = require('../middleware/validation');

// Public routes - Get products
router.get('/electronics', getElectronics);
router.get('/cars', getCars);
router.get('/spare-parts', getSpareParts);

// Admin only - Add products
router.post('/electronics', auth, role(['admin']), validateProduct, addElectronic);
router.post('/cars', auth, role(['admin']), validateProduct, addCar);
router.post('/spare-parts', auth, role(['admin']), validateProduct, addSparePart);

module.exports = router;
