import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaHome,
  FaUserMd,
  FaUsers,
  FaCalendarAlt,
  FaSignOutAlt,
  FaTimes,
  FaShieldAlt,
} from 'react-icons/fa';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: <FaHome className="text-xl" />,
      label: 'Dashboard',
    },
    {
      path: '/admin/doctors',
      icon: <FaUserMd className="text-xl" />,
      label: 'Manage Doctors',
    },
    {
      path: '/admin/users',
      icon: <FaUsers className="text-xl" />,
      label: 'Manage Users',
    },
    {
      path: '/admin/appointments',
      icon: <FaCalendarAlt className="text-xl" />,
      label: 'Appointments',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-30
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:shadow-md
        `}
      >
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <FaShieldAlt className="text-purple-600 text-xl" />
              </div>
              <div className="text-white">
                <p className="font-bold text-sm">{user?.name}</p>
                <p className="text-purple-200 text-xs">Admin</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white md:hidden"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${
                    location.pathname === item.path
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all font-medium w-full"
          >
            <FaSignOutAlt className="text-xl" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;