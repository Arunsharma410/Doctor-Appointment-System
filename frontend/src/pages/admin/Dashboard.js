import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  FaUserMd,
  FaUsers,
  FaCalendarAlt,
  FaRupeeSign,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUser,
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome, {user?.name}! 🛡️
        </h1>
        <p className="text-gray-500 mt-1">
          System overview and analytics
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Patients',
            value: stats?.users?.totalPatients || 0,
            icon: <FaUsers className="text-3xl" />,
            bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
          },
          {
            label: 'Total Doctors',
            value: stats?.users?.totalDoctors || 0,
            icon: <FaUserMd className="text-3xl" />,
            bg: 'bg-gradient-to-br from-green-500 to-green-600',
          },
          {
            label: 'Appointments',
            value: stats?.appointments?.total || 0,
            icon: <FaCalendarAlt className="text-3xl" />,
            bg: 'bg-gradient-to-br from-orange-500 to-orange-600',
          },
          {
            label: 'Revenue',
            value: `₹${stats?.totalRevenue || 0}`,
            icon: <FaRupeeSign className="text-3xl" />,
            bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`${stat.bg} text-white rounded-xl p-6 shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-sm font-medium">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="opacity-80">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Pending Approval',
            value: stats?.doctors?.pending || 0,
            icon: <FaClock className="text-2xl" />,
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
          },
          {
            label: 'Approved Doctors',
            value: stats?.doctors?.approved || 0,
            icon: <FaCheckCircle className="text-2xl" />,
            color: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-200',
          },
          {
            label: 'Rejected Doctors',
            value: stats?.doctors?.rejected || 0,
            icon: <FaTimesCircle className="text-2xl" />,
            color: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200',
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`${stat.bg} ${stat.border} border rounded-xl p-5`}
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 bg-white rounded-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Pending',
            value: stats?.appointments?.pending || 0,
            color: 'bg-yellow-500',
          },
          {
            label: 'Confirmed',
            value: stats?.appointments?.confirmed || 0,
            color: 'bg-blue-500',
          },
          {
            label: 'Completed',
            value: stats?.appointments?.completed || 0,
            color: 'bg-green-500',
          },
          {
            label: 'Cancelled',
            value: stats?.appointments?.cancelled || 0,
            color: 'bg-red-500',
          },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-5">
            <div
              className={`w-3 h-3 ${stat.color} rounded-full mb-2`}
            ></div>
            <p className="text-gray-500 text-xs">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Recent Appointments
          </h2>
          <Link
            to="/admin/appointments"
            className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
          >
            View All
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {stats?.recentAppointments?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {appointment.patientId?.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      with {appointment.doctorId?.userId?.name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Date</p>
                    <p className="font-medium text-gray-800 text-sm">
                      {appointment.date}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Time</p>
                    <p className="font-medium text-gray-800 text-sm">
                      {appointment.timeSlot}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(appointment.status)}`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No recent appointments
          </p>
        )}
      </div>
    </AdminLayout>
  );
};

export default Dashboard;