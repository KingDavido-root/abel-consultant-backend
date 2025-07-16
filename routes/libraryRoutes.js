const express = require('express');
const router = express.Router();
const { getLibraryProducts } = require('../controllers/libraryController');

// GET /api/library/products
router.get('/products', getLibraryProducts);

module.exports = router;

