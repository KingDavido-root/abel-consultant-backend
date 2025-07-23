const SparePart = require('../models/SparePart');

// Get all spare parts
const getAllSpareParts = async (req, res) => {
    try {
        const spareParts = await SparePart.find();
        res.json(spareParts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single spare part
const getSparePart = async (req, res) => {
    try {
        const sparePart = await SparePart.findById(req.params.id);
        if (sparePart) {
            res.json(sparePart);
        } else {
            res.status(404).json({ message: 'Spare part not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new spare part
const createSparePart = async (req, res) => {
    const sparePart = new SparePart({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        images: req.body.images,
        stock: req.body.stock
    });

    try {
        const newSparePart = await sparePart.save();
        res.status(201).json(newSparePart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a spare part
const updateSparePart = async (req, res) => {
    try {
        const sparePart = await SparePart.findById(req.params.id);
        if (sparePart) {
            Object.assign(sparePart, req.body);
            const updatedSparePart = await sparePart.save();
            res.json(updatedSparePart);
        } else {
            res.status(404).json({ message: 'Spare part not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a spare part
const deleteSparePart = async (req, res) => {
    try {
        const sparePart = await SparePart.findById(req.params.id);
        if (sparePart) {
            await sparePart.remove();
            res.json({ message: 'Spare part deleted' });
        } else {
            res.status(404).json({ message: 'Spare part not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllSpareParts,
    getSparePart,
    createSparePart,
    updateSparePart,
    deleteSparePart
};
