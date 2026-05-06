const express = require('express');
const router = express.Router();
const {
  createDoctorProfile,
  updateDoctorProfile,
  getAllDoctors,
  getSingleDoctor,
  getMyProfile,
  updateAvailability,
  getSpecializations,
} = require('../controllers/doctorController');

const { 
  protect, 
  doctorOnly 
} = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllDoctors);
router.get('/specializations', getSpecializations);

// Private routes (Doctor only)
// ⚠️ These MUST come BEFORE /:id route
router.get('/my-profile', protect, doctorOnly, getMyProfile);
router.post('/profile', protect, doctorOnly, createDoctorProfile);
router.put('/profile', protect, doctorOnly, updateDoctorProfile);
router.put('/availability', protect, doctorOnly, updateAvailability);

// ⚠️ This MUST be LAST always
router.get('/:id', getSingleDoctor);

module.exports = router;