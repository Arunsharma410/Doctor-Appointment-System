import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import {
  FaUserMd,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaStethoscope,
} from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    // Doctor specific fields
    specialization: '',
    experience: '',
    fees: '',
    city: '',
    hospital: '',
    qualifications: '',
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Specializations list
  const specializations = [
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Orthopedic',
    'Pediatrician',
    'Psychiatrist',
    'Gynecologist',
    'Ophthalmologist',
    'ENT Specialist',
    'Dentist',
    'General Physician',
    'Urologist',
    'Oncologist',
    'Radiologist',
    'Anesthesiologist',
  ];

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    // Doctor specific validations
    if (formData.role === 'doctor') {
      if (!formData.specialization) {
        newErrors.specialization = 'Specialization is required';
      }
      if (!formData.experience) {
        newErrors.experience = 'Experience is required';
      }
      if (!formData.fees) {
        newErrors.fees = 'Consultation fees is required';
      }
      if (!formData.city) {
        newErrors.city = 'City is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Step 1: Register user
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
      };

      const response = await axios.post('/auth/register', registerData);

      if (response.data.success) {
        // Save user to context
        login(response.data.data);

        // Step 2: If doctor, create doctor profile
        if (formData.role === 'doctor') {
          try {
            await axios.post('/doctors/profile', {
              specialization: formData.specialization,
              experience: Number(formData.experience),
              fees: Number(formData.fees),
              city: formData.city,
              hospital: formData.hospital,
              qualifications: formData.qualifications,
              bio: '',
            });
          } catch (profileError) {
            console.log('Profile creation error:', profileError);
          }
        }

        toast.success('Registration successful! Welcome to DocBook!');

        // Redirect based on role
        if (formData.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-4 rounded-full">
              <FaUserMd className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Create Account
          </h1>
          <p className="text-gray-600 mt-2">
            Join DocBook today
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-3">
              I am registering as:
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Patient Option */}
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, role: 'patient' })
                }
                className={`p-4 border-2 rounded-xl flex flex-col items-center space-y-2 transition-all ${
                  formData.role === 'patient'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-600 hover:border-blue-300'
                }`}
              >
                <FaUser className="text-2xl" />
                <span className="font-semibold">Patient</span>
                <span className="text-xs text-center text-gray-500">
                  Book appointments
                </span>
              </button>

              {/* Doctor Option */}
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, role: 'doctor' })
                }
                className={`p-4 border-2 rounded-xl flex flex-col items-center space-y-2 transition-all ${
                  formData.role === 'doctor'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-600 hover:border-blue-300'
                }`}
              >
                <FaStethoscope className="text-2xl" />
                <span className="font-semibold">Doctor</span>
                <span className="text-xs text-center text-gray-500">
                  Manage appointments
                </span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Basic Info Section */}
            <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${
                      errors.password
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 ${
                      errors.confirmPassword
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Doctor Specific Fields */}
            {formData.role === 'doctor' && (
              <>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">
                  Professional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Specialization */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Specialization *
                    </label>
                    <select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.specialization
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select Specialization</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                    {errors.specialization && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.specialization}
                      </p>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Experience (years) *
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Years of experience"
                      min="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.experience
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.experience && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.experience}
                      </p>
                    )}
                  </div>

                  {/* Fees */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Consultation Fees (₹) *
                    </label>
                    <input
                      type="number"
                      name="fees"
                      value={formData.fees}
                      onChange={handleChange}
                      placeholder="Enter fees amount"
                      min="0"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.fees
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.fees && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fees}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.city
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Hospital */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Hospital/Clinic
                    </label>
                    <input
                      type="text"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleChange}
                      placeholder="Hospital or clinic name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Qualifications */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Qualifications
                    </label>
                    <input
                      type="text"
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleChange}
                      placeholder="e.g. MBBS, MD"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Doctor Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Doctor accounts require admin approval before 
                    you can start accepting appointments.
                  </p>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;