import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUser,
  FaArrowRight,
  FaUserMd,
  FaRupeeSign,
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        '/appointments/doctor-appointments'
      );
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed')
      .length,
    completed: appointments.filter((a) => a.status === 'completed')
      .length,
    cancelled: appointments.filter((a) => a.status === 'cancelled')
      .length,
    revenue: appointments
      .filter((a) => a.status === 'completed')
      .reduce((sum, a) => sum + a.fees, 0),
  };

  // Status badge
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  // Get today appointments
  const todayAppointments = appointments.filter((a) => {
    const today = new Date().toISOString().split('T')[0];
    return a.date === today;
  });

  return (
    <DoctorLayout>

      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here is your practice summary
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Total Appointments',
            value: stats.total,
            icon: <FaCalendarAlt className="text-2xl" />,
            bg: 'bg-blue-50',
            text: 'text-blue-600',
          },
          {
            label: 'Pending',
            value: stats.pending,
            icon: <FaClock className="text-2xl" />,
            bg: 'bg-yellow-50',
            text: 'text-yellow-600',
          },
          {
            label: 'Confirmed',
            value: stats.confirmed,
            icon: <FaCheckCircle className="text-2xl" />,
            bg: 'bg-blue-50',
            text: 'text-blue-600',
          },
          {
            label: 'Completed',
            value: stats.completed,
            icon: <FaCheckCircle className="text-2xl" />,
            bg: 'bg-green-50',
            text: 'text-green-600',
          },
          {
            label: 'Cancelled',
            value: stats.cancelled,
            icon: <FaTimesCircle className="text-2xl" />,
            bg: 'bg-red-50',
            text: 'text-red-600',
          },
          {
            label: 'Total Revenue',
            value: `₹${stats.revenue}`,
            icon: <FaRupeeSign className="text-2xl" />,
            bg: 'bg-purple-50',
            text: 'text-purple-600',
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4"
          >
            <div className={`${stat.bg} ${stat.text} p-3 rounded-lg`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-xs">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Today's Appointments
            {todayAppointments.length > 0 && (
              <span className="ml-2 bg-green-100 text-green-700 text-sm px-2 py-0.5 rounded-full">
                {todayAppointments.length}
              </span>
            )}
          </h2>
          <Link
            to="/doctor/appointments"
            className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
          >
            View All
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : todayAppointments.length > 0 ? (
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4"
              >
                {/* Patient Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {appointment.patientId?.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {appointment.patientId?.phone}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Time</p>
                    <p className="font-medium text-gray-800 text-sm">
                      {appointment.timeSlot}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Fee</p>
                    <p className="font-medium text-green-600 text-sm">
                      ₹{appointment.fees}
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
          <div className="text-center py-8">
            <FaCalendarAlt className="text-gray-300 text-4xl mx-auto mb-3" />
            <p className="text-gray-500">
              No appointments scheduled for today
            </p>
          </div>
        )}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Recent Appointments
          </h2>
          <Link
            to="/doctor/appointments"
            className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
          >
            View All
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment._id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg gap-4"
              >
                {/* Patient Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {appointment.patientId?.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {appointment.patientId?.email}
                    </p>
                  </div>
                </div>

                {/* Details */}
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
          <div className="text-center py-8">
            <FaUserMd className="text-gray-300 text-4xl mx-auto mb-3" />
            <p className="text-gray-500">No appointments yet</p>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default Dashboard;