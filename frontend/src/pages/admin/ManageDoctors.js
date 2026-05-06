import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaEnvelope,
  FaPhone,
  FaRupeeSign,
  FaClock,
} from 'react-icons/fa';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/doctors');
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (doctorId) => {
    setActionLoading(doctorId + 'approve');
    try {
      const response = await axios.put(
        `/admin/doctors/${doctorId}/approve`
      );
      if (response.data.success) {
        toast.success('Doctor approved!');
        fetchDoctors();
      }
    } catch (error) {
      toast.error('Failed to approve doctor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (doctorId) => {
    if (!window.confirm('Reject this doctor?')) return;

    setActionLoading(doctorId + 'reject');
    try {
      const response = await axios.put(
        `/admin/doctors/${doctorId}/reject`
      );
      if (response.data.success) {
        toast.success('Doctor rejected');
        fetchDoctors();
      }
    } catch (error) {
      toast.error('Failed to reject doctor');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredDoctors =
    activeFilter === 'all'
      ? doctors
      : doctors.filter((d) => d.isApproved === activeFilter);

  const getStatusStyle = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      approved: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const filterButtons = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <AdminLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Manage Doctors
        </h1>
        <p className="text-gray-500 mt-1">
          Approve or reject doctor registrations
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
                ? doctors.length
                : doctors.filter((d) => d.isApproved === btn.value)
                    .length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Doctors List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredDoctors.length > 0 ? (
        <div className="space-y-4">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">

                  {/* Doctor Avatar */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaUserMd className="text-purple-600 text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <p className="font-bold text-gray-800 text-lg">
                            {doctor.userId?.name}
                          </p>
                          <p className="text-purple-600 font-medium text-sm">
                            {doctor.specialization}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${getStatusStyle(doctor.isApproved)}`}
                        >
                          {doctor.isApproved}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <FaEnvelope className="text-gray-400" />
                          {doctor.userId?.email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <FaPhone className="text-gray-400" />
                          {doctor.userId?.phone || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <FaClock className="text-gray-400" />
                          {doctor.experience} years experience
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <FaRupeeSign className="text-gray-400" />
                          ₹{doctor.fees}
                        </div>
                      </div>

                      {doctor.qualifications && (
                        <p className="text-gray-500 text-sm mt-2">
                          🎓 {doctor.qualifications}
                        </p>
                      )}

                      {doctor.hospital && (
                        <p className="text-gray-500 text-sm">
                          🏥 {doctor.hospital}, {doctor.city}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {doctor.isApproved === 'pending' && (
                  <div className="mt-4 flex gap-3 justify-end pt-4 border-t">
                    <button
                      onClick={() => handleApprove(doctor._id)}
                      disabled={actionLoading === doctor._id + 'approve'}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {actionLoading === doctor._id + 'approve' ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FaCheckCircle />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(doctor._id)}
                      disabled={actionLoading === doctor._id + 'reject'}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      {actionLoading === doctor._id + 'reject' ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FaTimesCircle />
                      )}
                      Reject
                    </button>
                  </div>
                )}

                {doctor.isApproved === 'rejected' && (
                  <div className="mt-4 flex gap-3 justify-end pt-4 border-t">
                    <button
                      onClick={() => handleApprove(doctor._id)}
                      disabled={actionLoading === doctor._id + 'approve'}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 text-sm font-medium"
                    >
                      <FaCheckCircle />
                      Approve Now
                    </button>
                  </div>
                )}

                {doctor.isApproved === 'approved' && (
                  <div className="mt-4 flex gap-3 justify-end pt-4 border-t">
                    <button
                      onClick={() => handleReject(doctor._id)}
                      disabled={actionLoading === doctor._id + 'reject'}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 text-sm font-medium"
                    >
                      <FaTimesCircle />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FaUserMd className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No Doctors Found
          </h3>
          <p className="text-gray-500">
            {activeFilter === 'all'
              ? 'No doctors registered yet'
              : `No ${activeFilter} doctors`}
          </p>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageDoctors;