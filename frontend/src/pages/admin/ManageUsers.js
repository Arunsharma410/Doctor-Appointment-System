import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  FaUser,
  FaUserMd,
  FaShieldAlt,
  FaEnvelope,
  FaPhone,
  FaTrash,
  FaFilter,
} from 'react-icons/fa';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"?`)) return;

    setDeleteLoading(userId);
    try {
      const response = await axios.delete(`/admin/users/${userId}`);
      if (response.data.success) {
        toast.success('User deleted');
        fetchUsers();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to delete user'
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredUsers =
    activeFilter === 'all'
      ? users
      : users.filter((u) => u.role === activeFilter);

  const getRoleStyle = (role) => {
    const styles = {
      patient: 'bg-blue-100 text-blue-700',
      doctor: 'bg-green-100 text-green-700',
      admin: 'bg-purple-100 text-purple-700',
    };
    return styles[role] || 'bg-gray-100 text-gray-700';
  };

  const getRoleIcon = (role) => {
    if (role === 'doctor') return <FaUserMd />;
    if (role === 'admin') return <FaShieldAlt />;
    return <FaUser />;
  };

  const filterButtons = [
    { value: 'all', label: 'All Users' },
    { value: 'patient', label: 'Patients' },
    { value: 'doctor', label: 'Doctors' },
    { value: 'admin', label: 'Admins' },
  ];

  return (
    <AdminLayout>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Manage Users
        </h1>
        <p className="text-gray-500 mt-1">
          View and manage all platform users
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FaFilter className="text-gray-500" />
          <span className="text-gray-600 font-medium text-sm">
            Filter by role:
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
                ? users.length
                : users.filter((u) => u.role === btn.value).length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {getRoleIcon(user.role)}
                        </div>
                        <span className="font-medium text-gray-800">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.phone || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleStyle(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() =>
                            handleDelete(user._id, user.name)
                          }
                          disabled={deleteLoading === user._id}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                        >
                          {deleteLoading === user._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <div key={user._id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      {getRoleIcon(user.role)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {user.name}
                      </p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getRoleStyle(user.role)} mt-1`}
                      >
                        {user.role}
                      </span>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <FaEnvelope className="text-xs" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <FaPhone className="text-xs" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {user.role !== 'admin' && (
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      disabled={deleteLoading === user._id}
                      className="text-red-500 p-2"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FaUser className="text-gray-300 text-6xl mx-auto mb-4" />
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageUsers;