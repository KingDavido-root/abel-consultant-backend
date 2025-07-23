const express = require('express');
const router = express.Router();
const {
    getAllElectronics,
    getElectronic,
    createElectronic,
    updateElectronic,
    deleteElectronic
} = require('../controllers/electronicsController');

// Routes
router.get('/', getAllElectronics);
router.get('/:id', getElectronic);
router.post('/', createElectronic);
router.put('/:id', updateElectronic);
router.delete('/:id', deleteElectronic);

module.exports = router;
