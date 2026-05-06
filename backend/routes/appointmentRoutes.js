const express = require('express');
const router = express.Router();
const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
  getSingleAppointment,
} = require('../controllers/appointmentController');

const {
  protect,
  patientOnly,
  doctorOnly,
} = require('../middleware/authMiddleware');

// Patient routes
router.post('/book', protect, patientOnly, bookAppointment);
router.get('/my-appointments', protect, patientOnly, getPatientAppointments);

// Doctor routes
router.get('/doctor-appointments', protect, doctorOnly, getDoctorAppointments);
router.put('/:id/confirm', protect, doctorOnly, confirmAppointment);
router.put('/:id/complete', protect, doctorOnly, completeAppointment);

// Both patient and doctor can cancel
router.put('/:id/cancel', protect, cancelAppointment);

// Get single appointment
router.get('/:id', protect, getSingleAppointment);

module.exports = router;