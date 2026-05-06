import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaNotesMedical,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter((a) => a.status === activeFilter)
      );
    }
  }, [activeFilter, appointments]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        '/appointments/doctor-appointments'
      );
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  // Confirm appointment
  const handleConfirm = async (appointmentId) => {
    setActionLoading(appointmentId + 'confirm');
    try {
      const response = await axios.put(
        `/appointments/${appointmentId}/confirm`
      );
      if (response.data.success) {
        toast.success('Appointment confirmed!');
        fetchAppointments();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to confirm'
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Complete appointment
  const handleComplete = async (appointmentId) => {
    setActionLoading(appointmentId + 'complete');
    try {
      const response = await axios.put(
        `/appointments/${appointmentId}/complete`
      );
      if (response.data.success) {
        toast.success('Appointment marked as completed!');
        fetchAppointments();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to complete'
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Cancel appointment
  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Cancel this appointment?')) return;

    setActionLoading(appointmentId + 'cancel');
    try {
      const response = await axios.put(
        `/appointments/${appointmentId}/cancel`,
        { cancelReason: 'Cancelled by doctor' }
      );
      if (response.data.success) {
        toast.success('Appointment cancelled');
        fetchAppointments();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to cancel'
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Status styles
  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border border-blue-200',
      completed: 'bg-green-100 text-green-700 border border-green-200',
      cancelled: 'bg-red-100 text-red-700 border border-red-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const filterButtons = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <DoctorLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Appointments
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your patient appointments
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="text-gray-500" />
          <span className="text-gray-600 font-medium text-sm">
            Filter by status:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setActiveFilter(btn.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === btn.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              {btn.label}
              {btn.value === 'all' ? (
                <span className="ml-1">({appointments.length})</span>
              ) : (
                <span className="ml-1">
                  (
                  {
                    appointments.filter((a) => a.status === btn.value)
                      .length
                  }
                  )
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(appointment.status)}`}
                >
                  {appointment.status}
                </span>
                <span className="text-gray-500 text-xs">
                  {new Date(appointment.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">

                  {/* Patient Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaUser className="text-green-600 text-2xl" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-lg">
                        {appointment.patientId?.name}
                      </p>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                        <FaEnvelope className="text-xs" />
                        <span>{appointment.patientId?.email}</span>
                      </div>
                      {appointment.patientId?.phone && (
                        <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                          <FaPhone className="text-xs" />
                          <span>{appointment.patientId.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="flex justify-center mb-1">
                        <FaCalendarAlt className="text-blue-500" />
                      </div>
                      <p className="text-gray-500 text-xs">Date</p>
                      <p className="font-semibold text-gray-800 text-sm">
                        {appointment.date}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="flex justify-center mb-1">
                        <FaClock className="text-green-500" />
                      </div>
                      <p className="text-gray-500 text-xs">Time</p>
                      <p className="font-semibold text-gray-800 text-sm">
                        {appointment.timeSlot}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="flex justify-center mb-1">
                        <FaRupeeSign className="text-purple-500" />
                      </div>
                      <p className="text-gray-500 text-xs">Fee</p>
                      <p className="font-semibold text-gray-800 text-sm">
                        ₹{appointment.fees}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Patient Notes */}
                {appointment.notes && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                    <FaNotesMedical className="text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-800 text-xs font-medium">
                        Patient Notes:
                      </p>
                      <p className="text-yellow-700 text-sm">
                        {appointment.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-3 justify-end">

                  {/* Confirm Button */}
                  {appointment.status === 'pending' && (
                    <button
                      onClick={() => handleConfirm(appointment._id)}
                      disabled={
                        actionLoading === appointment._id + 'confirm'
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {actionLoading ===
                      appointment._id + 'confirm' ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        <FaCheckCircle />
                      )}
                      Confirm
                    </button>
                  )}

                  {/* Complete Button */}
                  {(appointment.status === 'pending' ||
                    appointment.status === 'confirmed') && (
                    <button
                      onClick={() => handleComplete(appointment._id)}
                      disabled={
                        actionLoading === appointment._id + 'complete'
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {actionLoading ===
                      appointment._id + 'complete' ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                      ) : (
                        <FaCheckCircle />
                      )}
                      Complete
                    </button>
                  )}

                  {/* Cancel Button */}
                  {(appointment.status === 'pending' ||
                    appointment.status === 'confirmed') && (
                    <button
                      onClick={() => handleCancel(appointment._id)}
                      disabled={
                        actionLoading === appointment._id + 'cancel'
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {actionLoading ===
                      appointment._id + 'cancel' ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <FaTimesCircle />
                      )}
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FaCalendarAlt className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No Appointments Found
          </h3>
          <p className="text-gray-500">
            {activeFilter === 'all'
              ? 'No appointments yet'
              : `No ${activeFilter} appointments`}
          </p>
        </div>
      )}
    </DoctorLayout>
  );
};

export default DoctorAppointments;