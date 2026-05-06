import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import {
  FaUserMd,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaLock,
} from 'react-icons/fa';

const DoctorProfile = () => {
  const { user,login} = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    specialization: '',
    experience: '',
    fees: '',
    bio: '',
    city: '',
    hospital: '',
    qualifications: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const specializations = [
    'Cardiologist', 'Dermatologist', 'Neurologist',
    'Orthopedic', 'Pediatrician', 'Psychiatrist',
    'Gynecologist', 'Ophthalmologist', 'ENT Specialist',
    'Dentist', 'General Physician', 'Urologist',
  ];

 useEffect(() => {
  fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/doctors/my-profile');
      if (response.data.success) {
        const doc = response.data.data;
        setProfileData({
          name: user?.name || '',
          phone: user?.phone || '',
          specialization: doc.specialization || '',
          experience: doc.experience || '',
          fees: doc.fees || '',
          bio: doc.bio || '',
          city: doc.city || '',
          hospital: doc.hospital || '',
          qualifications: doc.qualifications || '',
        });
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setFetchLoading(false);
    }
  };

 const handleProfileUpdate = async (e) => {
  e.preventDefault();
  setProfileLoading(true);

  try {
    // Update user info (name, phone)
    const userResponse = await axios.put('/auth/profile', {
      name: profileData.name,
      phone: profileData.phone,
    });

    // Update login context with new user data
    if (userResponse.data.success) {
      login(userResponse.data.data);
    }

    // Update doctor profile
    await axios.put('/doctors/profile', {
      specialization: profileData.specialization,
      experience: Number(profileData.experience),
      fees: Number(profileData.fees),
      bio: profileData.bio,
      city: profileData.city,
      hospital: profileData.hospital,
      qualifications: profileData.qualifications,
    });

    toast.success('Profile updated successfully!');
    fetchProfile();
  } catch (error) {
    toast.error(
      error.response?.data?.message || 'Failed to update profile'
    );
  } finally {
    setProfileLoading(false);
  }
};

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      await axios.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to change password'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <DoctorLayout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          My Profile
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your professional information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FaUserMd className="text-green-600 text-4xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {user?.name}
            </h2>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mt-1">
              Doctor
            </span>
          </div>

          <form onSubmit={handleProfileUpdate}>
            <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 gap-4 mb-4">

              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Phone
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">
              Professional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

              {/* Specialization */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Specialization
                </label>
                <select
                  value={profileData.specialization}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      specialization: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select</option>
                  {specializations.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Experience (years)
                </label>
                <input
                  type="number"
                  value={profileData.experience}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      experience: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Fees */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Consultation Fees (₹)
                </label>
                <input
                  type="number"
                  value={profileData.fees}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      fees: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  City
                </label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      city: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Hospital */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Hospital/Clinic
                </label>
                <input
                  type="text"
                  value={profileData.hospital}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      hospital: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">
                  Qualifications
                </label>
                <input
                  type="text"
                  value={profileData.qualifications}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      qualifications: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Bio
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    bio: e.target.value,
                  })
                }
                rows="3"
                placeholder="Write about yourself..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={profileLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {profileLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  Save Profile
                </>
              )}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaLock className="text-green-600" />
            Change Password
          </h3>

          <form onSubmit={handlePasswordChange}>

            {/* Current Password */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1 text-sm">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
                  placeholder="Current password"
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
              <label className="block text-gray-700 font-medium mb-1 text-sm">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
                  placeholder="New password"
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

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1 text-sm">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Repeat new password"
              />
            </div>

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
    </DoctorLayout>
  );
};

export default DoctorProfile;