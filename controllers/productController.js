const Electronic = require('../models/Electronic');
const Car = require('../models/Car');
const SparePart = require('../models/SparePart');

// ------------------- Add product controllers -------------------
exports.addElectronic = async (req, res) => {
  try {
    const { title, description, price, images, stock } = req.body;
    if (!title || !price) return res.status(400).json({ message: 'Title and price are required' });

    const newProduct = new Electronic({ title, description, price, images, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error adding electronic:', err);
    res.status(500).json({ message: 'Server error while adding electronic' });
  }
};

exports.addCar = async (req, res) => {
  try {
    const { title, description, price, images, stock } = req.body;
    if (!title || !price) return res.status(400).json({ message: 'Title and price are required' });

    const newProduct = new Car({ title, description, price, images, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error adding car:', err);
    res.status(500).json({ message: 'Server error while adding car' });
  }
};

exports.addSparePart = async (req, res) => {
  try {
    const { title, description, price, images, stock } = req.body;
    if (!title || !price) return res.status(400).json({ message: 'Title and price are required' });

    const newProduct = new SparePart({ title, description, price, images, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error adding spare part:', err);
    res.status(500).json({ message: 'Server error while adding spare part' });
  }
};

// ------------------- Get products controllers -------------------
exports.getElectronics = async (req, res) => {
  try {
    const products = await Electronic.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error fetching electronics:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCars = async (req, res) => {
  try {
    const products = await Car.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error fetching cars:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSpareParts = async (req, res) => {
  try {
    const products = await SparePart.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error('Error fetching spare parts:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
