import React, { useState } from 'react';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import PatientLayout from '../../components/patient/PatientLayout';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaSave,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

const Profile = () => {
  const { user, login } = useAuth();

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // UI states
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!profileData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setProfileLoading(true);
    try {
      const response = await axios.put('/auth/profile', profileData);

      if (response.data.success) {
        // Update user in context
        login(response.data.data);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      toast.error('Please enter current password');
      return;
    }

    if (!passwordData.newPassword) {
      toast.error('Please enter new password');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await axios.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (response.data.success) {
        toast.success('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to change password'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <PatientLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          My Profile
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Profile Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FaUser className="text-blue-600 text-4xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {user?.name}
            </h2>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium capitalize mt-1">
              {user?.role}
            </span>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleProfileUpdate}>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaUser className="text-blue-600" />
              Personal Information
            </h3>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Email (Read only) */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user?.email}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <FaEnvelope className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
                <FaPhone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={profileLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {profileLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaLock className="text-blue-600" />
            Change Password
          </h3>

          <form onSubmit={handlePasswordChange}>

            {/* Current Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="Repeat new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Change Password Button */}
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {passwordLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Changing...
                </>
              ) : (
                <>
                  <FaLock />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </PatientLayout>
  );
};

export default Profile;