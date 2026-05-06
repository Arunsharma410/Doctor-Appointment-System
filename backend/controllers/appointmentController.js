const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// -----------------------------------------------
// @desc    Book appointment
// @route   POST /api/appointments/book
// @access  Private (Patient only)
// -----------------------------------------------
const bookAppointment = asyncHandler(async (req, res) => {
  const { doctorId, date, timeSlot, notes } = req.body;

  // Check all fields
  if (!doctorId || !date || !timeSlot) {
    res.status(400);
    throw new Error('Please provide doctorId, date and timeSlot');
  }

  // Check if doctor exists and is approved
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  if (doctor.isApproved !== 'approved') {
    res.status(400);
    throw new Error('Doctor is not approved yet');
  }

  // Check if slot is already booked
  const existingAppointment = await Appointment.findOne({
    doctorId,
    date,
    timeSlot,
    status: { $nin: ['cancelled'] },
  });

  if (existingAppointment) {
    res.status(400);
    throw new Error('This slot is already booked. Please choose another slot');
  }

  // Check if patient already has appointment on same date and time
  const patientAppointment = await Appointment.findOne({
    patientId: req.user._id,
    date,
    timeSlot,
    status: { $nin: ['cancelled'] },
  });

  if (patientAppointment) {
    res.status(400);
    throw new Error('You already have an appointment at this time');
  }

  // Create appointment
  const appointment = await Appointment.create({
    patientId: req.user._id,
    doctorId,
    date,
    timeSlot,
    fees: doctor.fees,
    notes: notes || '',
  });

  // Populate with doctor and patient details
  const populatedAppointment = await Appointment.findById(appointment._id)
    .populate('patientId', 'name email phone')
    .populate({
      path: 'doctorId',
      populate: {
        path: 'userId',
        select: 'name email phone',
      },
    });

  res.status(201).json({
    success: true,
    message: 'Appointment booked successfully',
    data: populatedAppointment,
  });
});

// -----------------------------------------------
// @desc    Get patient appointments
// @route   GET /api/appointments/my-appointments
// @access  Private (Patient only)
// -----------------------------------------------
const getPatientAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    patientId: req.user._id,
  })
    .populate({
      path: 'doctorId',
      populate: {
        path: 'userId',
        select: 'name email phone profilePhoto',
      },
    })
    .sort({ createdAt: -1 }); // newest first

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

// -----------------------------------------------
// @desc    Get doctor appointments
// @route   GET /api/appointments/doctor-appointments
// @access  Private (Doctor only)
// -----------------------------------------------
const getDoctorAppointments = asyncHandler(async (req, res) => {
  // First get doctor profile
  const doctor = await Doctor.findOne({ userId: req.user._id });

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  const appointments = await Appointment.find({
    doctorId: doctor._id,
  })
    .populate('patientId', 'name email phone profilePhoto')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

// -----------------------------------------------
// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private (Patient or Doctor)
// -----------------------------------------------
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check if appointment belongs to this patient
  // or this doctor
  const doctor = await Doctor.findOne({ userId: req.user._id });

  const isPatient =
    appointment.patientId.toString() === req.user._id.toString();
  const isDoctor =
    doctor && appointment.doctorId.toString() === doctor._id.toString();

  if (!isPatient && !isDoctor) {
    res.status(403);
    throw new Error('Not authorized to cancel this appointment');
  }

  // Check if already cancelled or completed
  if (appointment.status === 'cancelled') {
    res.status(400);
    throw new Error('Appointment is already cancelled');
  }

  if (appointment.status === 'completed') {
    res.status(400);
    throw new Error('Cannot cancel a completed appointment');
  }

  appointment.status = 'cancelled';
  appointment.cancelReason = req.body.cancelReason || 'No reason provided';
  await appointment.save();

  res.status(200).json({
    success: true,
    message: 'Appointment cancelled successfully',
    data: appointment,
  });
});

// -----------------------------------------------
// @desc    Confirm appointment (Doctor confirms)
// @route   PUT /api/appointments/:id/confirm
// @access  Private (Doctor only)
// -----------------------------------------------
const confirmAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check if this doctor owns this appointment
  const doctor = await Doctor.findOne({ userId: req.user._id });

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  if (appointment.doctorId.toString() !== doctor._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to confirm this appointment');
  }

  if (appointment.status === 'cancelled') {
    res.status(400);
    throw new Error('Cannot confirm a cancelled appointment');
  }

  appointment.status = 'confirmed';
  await appointment.save();

  res.status(200).json({
    success: true,
    message: 'Appointment confirmed successfully',
    data: appointment,
  });
});

// -----------------------------------------------
// @desc    Complete appointment (Doctor marks complete)
// @route   PUT /api/appointments/:id/complete
// @access  Private (Doctor only)
// -----------------------------------------------
const completeAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const doctor = await Doctor.findOne({ userId: req.user._id });

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  if (appointment.doctorId.toString() !== doctor._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (appointment.status === 'cancelled') {
    res.status(400);
    throw new Error('Cannot complete a cancelled appointment');
  }

  appointment.status = 'completed';
  await appointment.save();

  res.status(200).json({
    success: true,
    message: 'Appointment marked as completed',
    data: appointment,
  });
});

// -----------------------------------------------
// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
// -----------------------------------------------
const getSingleAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('patientId', 'name email phone')
    .populate({
      path: 'doctorId',
      populate: {
        path: 'userId',
        select: 'name email phone',
      },
    });

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

module.exports = {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  cancelAppointment,
  confirmAppointment,
  completeAppointment,
  getSingleAppointment,
};