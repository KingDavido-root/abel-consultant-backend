const jwt = require('jsonwebtoken');

// Protect routes - verify token
exports.protect = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer token
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    req.user = {
      _id: decoded.user.id,  // Make sure we have _id available
      id: decoded.user.id,
      role: decoded.user.role
    };
    console.log('Set user in request:', req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin only middleware
exports.adminOnly = function (req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
