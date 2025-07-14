const express = require('express');
const router = express.Router();
const { addElectronic, getElectronics } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Public
router.get('/electronics', getElectronics);

// Admin only
router.post('/electronics', auth, role(['admin']), addElectronic);

module.exports = router;
