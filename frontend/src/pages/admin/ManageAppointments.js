import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  FaCalendarAlt,
  FaUser,
  FaUserMd,
  FaClock,
  FaRupeeSign,
  FaTrash,
  FaFilter,
} from 'react-icons/fa';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/appointments');
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Delete this appointment?')) return;

    setDeleteLoading(appointmentId);
    try {
      const response = await axios.delete(
        `/admin/appointments/${appointmentId}`
      );
      if (response.data.success) {
        toast.success('Appointment deleted');
        fetchAppointments();
      }
    } catch (error) {
      toast.error('Failed to delete appointment');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredAppointments =
    activeFilter === 'all'
      ? appointments
      : appointments.filter((a) => a.status === activeFilter);

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
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
    <AdminLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          All Appointments
        </h1>
        <p className="text-gray-500 mt-1">
          View and manage all appointments
        </p>
      </div>

      {/* Filters */}
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
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              {btn.label} (
              {btn.value === 'all'
                ? appointments.length
                : appointments.filter((a) => a.status === btn.value)
                    .length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">

                {/* Patient & Doctor Info */}
                <div className="flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${getStatusStyle(appointment.status)}`}
                    >
                      {appointment.status}
                    </span>
                    <span className="text-gray-400 text-xs">
                      ID: {appointment._id.slice(-6)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Patient */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Patient</p>
                        <p className="font-semibold text-gray-800 text-sm">
                          {appointment.patientId?.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {appointment.patientId?.email}
                        </p>
                      </div>
                    </div>

                    {/* Doctor */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <FaUserMd className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Doctor</p>
                        <p className="font-semibold text-gray-800 text-sm">
                          {appointment.doctorId?.userId?.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {appointment.doctorId?.specialization}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-wrap gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center min-w-[80px]">
                    <FaCalendarAlt className="text-blue-500 mx-auto mb-1" />
                    <p className="text-gray-500 text-xs">Date</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {appointment.date}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center min-w-[80px]">
                    <FaClock className="text-green-500 mx-auto mb-1" />
                    <p className="text-gray-500 text-xs">Time</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {appointment.timeSlot}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center min-w-[80px]">
                    <FaRupeeSign className="text-purple-500 mx-auto mb-1" />
                    <p className="text-gray-500 text-xs">Fee</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      ₹{appointment.fees}
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(appointment._id)}
                  disabled={deleteLoading === appointment._id}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  {deleteLoading === appointment._id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></div>
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FaCalendarAlt className="text-gray-300 text-6xl mx-auto mb-4" />
          <p className="text-gray-500">No appointments found</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageAppointments;