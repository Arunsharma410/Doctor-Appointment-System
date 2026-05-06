import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../components/patient/PatientLayout';
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUserMd,
  FaArrowRight,
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
      const response = await axios.get('/appointments/my-appointments');
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
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  // Status badge colors
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <PatientLayout>

      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here is your health summary
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total',
            value: stats.total,
            icon: <FaCalendarAlt className="text-2xl" />,
            color: 'bg-blue-500',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
          },
          {
            label: 'Pending',
            value: stats.pending,
            icon: <FaClock className="text-2xl" />,
            color: 'bg-yellow-500',
            bg: 'bg-yellow-50',
            text: 'text-yellow-600',
          },
          {
            label: 'Completed',
            value: stats.completed,
            icon: <FaCheckCircle className="text-2xl" />,
            color: 'bg-green-500',
            bg: 'bg-green-50',
            text: 'text-green-600',
          },
          {
            label: 'Cancelled',
            value: stats.cancelled,
            icon: <FaTimesCircle className="text-2xl" />,
            color: 'bg-red-500',
            bg: 'bg-red-50',
            text: 'text-red-600',
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
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Recent Appointments
          </h2>
          <Link
            to="/patient/appointments"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            View All
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.slice(0, 5).map((appointment) => (
              <div
                key={appointment._id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors gap-4"
              >
                {/* Doctor Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUserMd className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {appointment.doctorId?.userId?.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {appointment.doctorId?.specialization}
                    </p>
                  </div>
                </div>

                {/* Appointment Details */}
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
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Fee</p>
                    <p className="font-medium text-blue-600 text-sm">
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
          <div className="text-center py-12">
            <FaCalendarAlt className="text-gray-300 text-5xl mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              No appointments yet
            </p>
            <Link
              to="/doctors"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
            >
              <FaUserMd />
              Find a Doctor
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/doctors"
          className="bg-blue-600 text-white rounded-xl p-6 hover:bg-blue-700 transition-colors flex items-center gap-4"
        >
          <FaUserMd className="text-4xl opacity-80" />
          <div>
            <h3 className="font-bold text-lg">Find a Doctor</h3>
            <p className="text-blue-100 text-sm">
              Browse and book appointments
            </p>
          </div>
          <FaArrowRight className="ml-auto" />
        </Link>

        <Link
          to="/patient/appointments"
          className="bg-green-600 text-white rounded-xl p-6 hover:bg-green-700 transition-colors flex items-center gap-4"
        >
          <FaCalendarAlt className="text-4xl opacity-80" />
          <div>
            <h3 className="font-bold text-lg">My Appointments</h3>
            <p className="text-green-100 text-sm">
              View and manage appointments
            </p>
          </div>
          <FaArrowRight className="ml-auto" />
        </Link>
      </div>
    </PatientLayout>
  );
};

export default Dashboard;