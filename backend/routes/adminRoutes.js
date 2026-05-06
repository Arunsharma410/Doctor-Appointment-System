const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getSingleUser,
  deleteUser,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  getAllAppointments,
  deleteAppointment,
} = require('../controllers/adminController');

const {
  protect,
  adminOnly,
} = require('../middleware/authMiddleware');

// All routes are admin only
// protect → check token
// adminOnly → check role is admin

router.get('/stats', protect, adminOnly, getDashboardStats);

// User routes
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/users/:id', protect, adminOnly, getSingleUser);
router.delete('/users/:id', protect, adminOnly, deleteUser);

// Doctor routes
router.get('/doctors', protect, adminOnly, getAllDoctors);
router.put('/doctors/:id/approve', protect, adminOnly, approveDoctor);
router.put('/doctors/:id/reject', protect, adminOnly, rejectDoctor);

// Appointment routes
router.get('/appointments', protect, adminOnly, getAllAppointments);
router.delete('/appointments/:id', protect, adminOnly, deleteAppointment);

module.exports = router;