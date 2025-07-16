// controllers/libraryController.js
const axios = require('axios');

// Get free products from Fake Store API
exports.getLibraryProducts = async (req, res) => {
  const { category } = req.query;
  const baseUrl = 'https://fakestoreapi.com/products';
  const url = category ? `${baseUrl}/category/${encodeURIComponent(category)}` : baseUrl;
  try {
    const response = await axios.get(url);
    return res.json({
      success: true,
      products: response.data,
    });
  } catch (err) {
    console.error('Library fetch error:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch product library',
    });
  }
};

