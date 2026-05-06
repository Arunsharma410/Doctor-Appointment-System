const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// -----------------------------------------------
// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
// -----------------------------------------------
const getDashboardStats = asyncHandler(async (req, res) => {
  // Count all users
  const totalPatients = await User.countDocuments({ role: 'patient' });
  const totalDoctors = await User.countDocuments({ role: 'doctor' });

  // Count doctors by approval status
  const pendingDoctors = await Doctor.countDocuments({
    isApproved: 'pending',
  });
  const approvedDoctors = await Doctor.countDocuments({
    isApproved: 'approved',
  });
  const rejectedDoctors = await Doctor.countDocuments({
    isApproved: 'rejected',
  });

  // Count appointments by status
  const totalAppointments = await Appointment.countDocuments();
  const pendingAppointments = await Appointment.countDocuments({
    status: 'pending',
  });
  const confirmedAppointments = await Appointment.countDocuments({
    status: 'confirmed',
  });
  const completedAppointments = await Appointment.countDocuments({
    status: 'completed',
  });
  const cancelledAppointments = await Appointment.countDocuments({
    status: 'cancelled',
  });

  // Calculate total revenue
  // Only from completed appointments
  const revenueData = await Appointment.aggregate([
    {
      $match: { status: 'completed' },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$fees' },
      },
    },
  ]);

  const totalRevenue =
    revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  // Get recent appointments (last 5)
  const recentAppointments = await Appointment.find()
    .populate('patientId', 'name email')
    .populate({
      path: 'doctorId',
      populate: {
        path: 'userId',
        select: 'name',
      },
    })
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      users: {
        totalPatients,
        totalDoctors,
      },
      doctors: {
        pending: pendingDoctors,
        approved: approvedDoctors,
        rejected: rejectedDoctors,
      },
      appointments: {
        total: totalAppointments,
        pending: pendingAppointments,
        confirmed: confirmedAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
      },
      totalRevenue,
      recentAppointments,
    },
  });
});

// -----------------------------------------------
// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
// -----------------------------------------------
const getAllUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;

  let filter = {};
  if (role) {
    filter.role = role;
  }

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// -----------------------------------------------
// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
// -----------------------------------------------
const getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// -----------------------------------------------
// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
// -----------------------------------------------
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent deleting admin
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete admin user');
  }

  // If doctor, delete doctor profile too
  if (user.role === 'doctor') {
    await Doctor.findOneAndDelete({ userId: user._id });
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

// -----------------------------------------------
// @desc    Get all doctors (with pending ones)
// @route   GET /api/admin/doctors
// @access  Private (Admin only)
// -----------------------------------------------
const getAllDoctors = asyncHandler(async (req, res) => {
  const { status } = req.query;

  let filter = {};
  if (status) {
    filter.isApproved = status;
  }

  const doctors = await Doctor.find(filter)
    .populate('userId', 'name email phone profilePhoto')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: doctors.length,
    data: doctors,
  });
});

// -----------------------------------------------
// @desc    Approve doctor
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private (Admin only)
// -----------------------------------------------
const approveDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  doctor.isApproved = 'approved';
  await doctor.save();

  res.status(200).json({
    success: true,
    message: 'Doctor approved successfully',
    data: doctor,
  });
});

// -----------------------------------------------
// @desc    Reject doctor
// @route   PUT /api/admin/doctors/:id/reject
// @access  Private (Admin only)
// -----------------------------------------------
const rejectDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  doctor.isApproved = 'rejected';
  await doctor.save();

  res.status(200).json({
    success: true,
    message: 'Doctor rejected successfully',
    data: doctor,
  });
});

// -----------------------------------------------
// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private (Admin only)
// -----------------------------------------------
const getAllAppointments = asyncHandler(async (req, res) => {
  const { status } = req.query;

  let filter = {};
  if (status) {
    filter.status = status;
  }

  const appointments = await Appointment.find(filter)
    .populate('patientId', 'name email phone')
    .populate({
      path: 'doctorId',
      populate: {
        path: 'userId',
        select: 'name email',
      },
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: appointments.length,
    data: appointments,
  });
});

// -----------------------------------------------
// @desc    Delete appointment
// @route   DELETE /api/admin/appointments/:id
// @access  Private (Admin only)
// -----------------------------------------------
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  await Appointment.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Appointment deleted successfully',
  });
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  getSingleUser,
  deleteUser,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  getAllAppointments,
  deleteAppointment,
};