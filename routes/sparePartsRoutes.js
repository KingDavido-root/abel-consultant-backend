const express = require('express');
const router = express.Router();
const {
    getAllSpareParts,
    getSparePart,
    createSparePart,
    updateSparePart,
    deleteSparePart
} = require('../controllers/sparePartsController');

// Routes
router.get('/', getAllSpareParts);
router.get('/:id', getSparePart);
router.post('/', createSparePart);
router.put('/:id', updateSparePart);
router.delete('/:id', deleteSparePart);

module.exports = router;
