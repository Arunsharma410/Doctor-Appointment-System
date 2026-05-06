import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import PatientLayout from '../../components/patient/PatientLayout';
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaRupeeSign,
  FaTimesCircle,
  FaCheckCircle,
  FaFilter,
  FaNotesMedical,
} from 'react-icons/fa';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

useEffect(() => {
  const filterAppointments = () => {
    if (activeFilter === 'all') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(
        appointments.filter((a) => a.status === activeFilter)
      );
    }
  };
  filterAppointments();
}, [activeFilter, appointments]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/appointments/my-appointments');
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setCancellingId(appointmentId);
    try {
      const response = await axios.put(
        `/appointments/${appointmentId}/cancel`,
        { cancelReason: 'Cancelled by patient' }
      );

      if (response.data.success) {
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to cancel appointment'
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Status styles
  const getStatusStyle = (status) => {
    const styles = {
      pending: {
        badge: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        icon: <FaClock className="text-yellow-500" />,
      },
      confirmed: {
        badge: 'bg-blue-100 text-blue-700 border border-blue-200',
        icon: <FaCheckCircle className="text-blue-500" />,
      },
      completed: {
        badge: 'bg-green-100 text-green-700 border border-green-200',
        icon: <FaCheckCircle className="text-green-500" />,
      },
      cancelled: {
        badge: 'bg-red-100 text-red-700 border border-red-200',
        icon: <FaTimesCircle className="text-red-500" />,
      },
    };
    return styles[status] || styles.pending;
  };

  const filterButtons = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <PatientLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          My Appointments
        </h1>
        <p className="text-gray-500 mt-1">
          Manage all your appointments here
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => {
            const statusStyle = getStatusStyle(appointment.status);
            return (
              <div
                key={appointment._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {statusStyle.icon}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle.badge}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <span className="text-gray-500 text-xs">
                    Booked on:{' '}
                    {new Date(appointment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">

                    {/* Doctor Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FaUserMd className="text-blue-600 text-2xl" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">
                          {appointment.doctorId?.userId?.name}
                        </p>
                        <p className="text-blue-600 font-medium text-sm">
                          {appointment.doctorId?.specialization}
                        </p>
                        {appointment.doctorId?.hospital && (
                          <p className="text-gray-500 text-sm">
                            {appointment.doctorId.hospital}
                          </p>
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

                  {/* Notes */}
                  {appointment.notes && (
                    <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                      <FaNotesMedical className="text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-800 text-xs font-medium">
                          Your Notes:
                        </p>
                        <p className="text-yellow-700 text-sm">
                          {appointment.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Cancel Reason */}
                  {appointment.cancelReason &&
                    appointment.status === 'cancelled' && (
                      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-800 text-xs font-medium">
                          Cancel Reason:
                        </p>
                        <p className="text-red-700 text-sm">
                          {appointment.cancelReason}
                        </p>
                      </div>
                    )}

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-3 justify-end">
                    {/* Cancel Button */}
                    {(appointment.status === 'pending' ||
                      appointment.status === 'confirmed') && (
                      <button
                        onClick={() => handleCancel(appointment._id)}
                        disabled={cancellingId === appointment._id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        {cancellingId === appointment._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <FaTimesCircle />
                            Cancel
                          </>
                        )}
                      </button>
                    )}

                    {/* Book Again Button */}
                    {appointment.status === 'completed' && (
                      <Link
                        to={`/doctors/${appointment.doctorId?._id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        <FaCalendarAlt />
                        Book Again
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FaCalendarAlt className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No Appointments Found
          </h3>
          <p className="text-gray-500 mb-6">
            {activeFilter === 'all'
              ? "You haven't booked any appointments yet"
              : `No ${activeFilter} appointments found`}
          </p>
          <Link
            to="/doctors"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2 font-medium"
          >
            <FaUserMd />
            Find a Doctor
          </Link>
        </div>
      )}
    </PatientLayout>
  );
};

export default MyAppointments;