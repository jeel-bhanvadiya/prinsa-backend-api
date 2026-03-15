const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');

const authSuperAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await SuperAdmin.findById(decoded.userId).select('-password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid token. Super admin not found.' });
    }
    req.superAdmin = admin;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired.' });
    }
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { authSuperAdmin };
