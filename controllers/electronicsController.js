const Electronic = require('../models/Electronic');

// Get all electronics
const getAllElectronics = async (req, res) => {
    try {
        const electronics = await Electronic.find();
        res.json(electronics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single electronic
const getElectronic = async (req, res) => {
    try {
        const electronic = await Electronic.findById(req.params.id);
        if (electronic) {
            res.json(electronic);
        } else {
            res.status(404).json({ message: 'Electronic not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new electronic
const createElectronic = async (req, res) => {
    const electronic = new Electronic({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        images: req.body.images,
        stock: req.body.stock
    });

    try {
        const newElectronic = await electronic.save();
        res.status(201).json(newElectronic);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an electronic
const updateElectronic = async (req, res) => {
    try {
        const electronic = await Electronic.findById(req.params.id);
        if (electronic) {
            Object.assign(electronic, req.body);
            const updatedElectronic = await electronic.save();
            res.json(updatedElectronic);
        } else {
            res.status(404).json({ message: 'Electronic not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an electronic
const deleteElectronic = async (req, res) => {
    try {
        const electronic = await Electronic.findById(req.params.id);
        if (electronic) {
            await electronic.remove();
            res.json({ message: 'Electronic deleted' });
        } else {
            res.status(404).json({ message: 'Electronic not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllElectronics,
    getElectronic,
    createElectronic,
    updateElectronic,
    deleteElectronic
};
