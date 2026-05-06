const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// -----------------------------------------------
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// -----------------------------------------------
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'patient',
    phone: phone || '',
  });

  if (user) {
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
        token: generateToken(user._id, user.role),
      },
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// -----------------------------------------------
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// -----------------------------------------------
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
        token: generateToken(user._id, user.role),
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// -----------------------------------------------
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
// -----------------------------------------------
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');

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
// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
// -----------------------------------------------
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.body.name) {
    user.name = req.body.name;
  }
  if (req.body.phone !== undefined) {
    user.phone = req.body.phone;
  }
  if (req.body.profilePhoto !== undefined) {
    user.profilePhoto = req.body.profilePhoto;
  }

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      profilePhoto: updatedUser.profilePhoto,
      token: generateToken(updatedUser._id, updatedUser.role),
    },
  });
});

// -----------------------------------------------
// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
// -----------------------------------------------
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  const user = await User.findById(req.user._id);

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

// -----------------------------------------------
// EXPORT ALL FUNCTIONS
// -----------------------------------------------
module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
};