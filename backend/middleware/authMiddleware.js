const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// -----------------------------------------------
// Protect routes - verify JWT token
// -----------------------------------------------
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      // Header looks like: "Bearer eyJhbGciOiJIUzI1..."
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

// -----------------------------------------------
// Admin only middleware
// -----------------------------------------------
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied - Admin only');
  }
};

// -----------------------------------------------
// Doctor only middleware
// -----------------------------------------------
const doctorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'doctor') {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied - Doctor only');
  }
};

// -----------------------------------------------
// Patient only middleware
// -----------------------------------------------
const patientOnly = (req, res, next) => {
  if (req.user && req.user.role === 'patient') {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied - Patient only');
  }
};

// -----------------------------------------------
// Doctor or Admin middleware
// -----------------------------------------------
const doctorOrAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'doctor' || req.user.role === 'admin')
  ) {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied');
  }
};

module.exports = { 
  protect, 
  adminOnly, 
  doctorOnly, 
  patientOnly,
  doctorOrAdmin 
};