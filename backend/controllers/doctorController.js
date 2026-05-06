const asyncHandler = require('express-async-handler');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// -----------------------------------------------
// @desc    Create doctor profile
// @route   POST /api/doctors/profile
// @access  Private (Doctor only)
// -----------------------------------------------
const createDoctorProfile = asyncHandler(async (req, res) => {
  const {
    specialization,
    experience,
    fees,
    bio,
    city,
    hospital,
    qualifications,
  } = req.body;

  // Check if doctor profile already exists
  const existingProfile = await Doctor.findOne({ userId: req.user._id });
  if (existingProfile) {
    res.status(400);
    throw new Error('Doctor profile already exists');
  }

  // Create doctor profile
  const doctor = await Doctor.create({
    userId: req.user._id,
    specialization,
    experience,
    fees,
    bio,
    city,
    hospital,
    qualifications,
  });

  res.status(201).json({
    success: true,
    message: 'Doctor profile created successfully',
    data: doctor,
  });
});

// -----------------------------------------------
// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private (Doctor only)
// -----------------------------------------------
const updateDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user._id });

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  // Update fields only if provided
  doctor.specialization = req.body.specialization !== undefined 
    ? req.body.specialization 
    : doctor.specialization;
    
  doctor.experience = req.body.experience !== undefined 
    ? req.body.experience 
    : doctor.experience;
    
  doctor.fees = req.body.fees !== undefined 
    ? req.body.fees 
    : doctor.fees;
    
  doctor.bio = req.body.bio !== undefined 
    ? req.body.bio 
    : doctor.bio;
    
  doctor.city = req.body.city !== undefined 
    ? req.body.city 
    : doctor.city;
    
  doctor.hospital = req.body.hospital !== undefined 
    ? req.body.hospital 
    : doctor.hospital;
    
  doctor.qualifications = req.body.qualifications !== undefined 
    ? req.body.qualifications 
    : doctor.qualifications;

  const updatedDoctor = await doctor.save();

  res.status(200).json({
    success: true,
    message: 'Doctor profile updated successfully',
    data: updatedDoctor,
  });
});

// -----------------------------------------------
// @desc    Get all approved doctors
// @route   GET /api/doctors
// @access  Public
// -----------------------------------------------
const getAllDoctors = asyncHandler(async (req, res) => {
  // Get query parameters for filtering
  const { specialization, city, search } = req.query;

  // Build filter object
  let filter = { isApproved: 'approved' };

  if (specialization) {
    filter.specialization = {
      $regex: specialization,
      $options: 'i', // case insensitive
    };
  }

  if (city) {
    filter.city = {
      $regex: city,
      $options: 'i',
    };
  }

  // Get doctors with user details
  let doctors = await Doctor.find(filter).populate(
    'userId',
    'name email phone profilePhoto'
  );

  // Search by doctor name
  if (search) {
    doctors = doctors.filter((doc) =>
      doc.userId.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.status(200).json({
    success: true,
    count: doctors.length,
    data: doctors,
  });
});

// -----------------------------------------------
// @desc    Get single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
// -----------------------------------------------
const getSingleDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id).populate(
    'userId',
    'name email phone profilePhoto'
  );

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor not found');
  }

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

// -----------------------------------------------
// @desc    Get doctor profile (logged in doctor)
// @route   GET /api/doctors/my-profile
// @access  Private (Doctor only)
// -----------------------------------------------
const getMyProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findOne({ userId: req.user._id }).populate(
    'userId',
    'name email phone profilePhoto'
  );

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found. Please create one.');
  }

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

// -----------------------------------------------
// @desc    Update availability slots
// @route   PUT /api/doctors/availability
// @access  Private (Doctor only)
// -----------------------------------------------
const updateAvailability = asyncHandler(async (req, res) => {
  const { availability } = req.body;

  // availability should be array like:
  // [{ day: 'Monday', slots: ['9:00 AM', '10:00 AM'] }]

  if (!availability || !Array.isArray(availability)) {
    res.status(400);
    throw new Error('Please provide availability as an array');
  }

  const doctor = await Doctor.findOne({ userId: req.user._id });

  if (!doctor) {
    res.status(404);
    throw new Error('Doctor profile not found');
  }

  doctor.availability = availability;
  await doctor.save();

  res.status(200).json({
    success: true,
    message: 'Availability updated successfully',
    data: doctor.availability,
  });
});

// -----------------------------------------------
// @desc    Get all specializations (unique list)
// @route   GET /api/doctors/specializations
// @access  Public
// -----------------------------------------------
const getSpecializations = asyncHandler(async (req, res) => {
  const specializations = await Doctor.distinct('specialization', {
    isApproved: 'approved',
  });

  res.status(200).json({
    success: true,
    data: specializations,
  });
});

module.exports = {
  createDoctorProfile,
  updateDoctorProfile,
  getAllDoctors,
  getSingleDoctor,
  getMyProfile,
  updateAvailability,
  getSpecializations,
};