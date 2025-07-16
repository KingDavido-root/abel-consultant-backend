const validateProduct = (req, res, next) => {
  const { title, price } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ 
      message: 'Title is required and must be a non-empty string' 
    });
  }
  
  if (!price || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ 
      message: 'Price is required and must be a positive number' 
    });
  }
  
  // Sanitize inputs
  req.body.title = title.trim();
  req.body.description = req.body.description?.trim() || '';
  
  next();
};

const validateOrder = (req, res, next) => {
  const { productType, productId } = req.body;
  
  if (!productType || !['electronic', 'car', 'sparepart'].includes(productType)) {
    return res.status(400).json({ 
      message: 'Product type is required and must be one of: electronic, car, sparepart' 
    });
  }
  
  if (!productId || typeof productId !== 'string' || productId.trim().length === 0) {
    return res.status(400).json({ 
      message: 'Product ID is required and must be a non-empty string' 
    });
  }
  
  next();
};

const validateAuth = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ 
      message: 'Valid email is required' 
    });
  }
  
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ 
      message: 'Password is required and must be at least 6 characters' 
    });
  }
  
  next();
};

module.exports = {
  validateProduct,
  validateOrder,
  validateAuth
};
