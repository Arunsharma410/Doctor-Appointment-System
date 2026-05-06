import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { FaBars, FaShieldAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-600 text-2xl"
        >
          <FaBars />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <FaShieldAlt className="text-purple-600 text-xl" />
          <span className="font-bold text-purple-600">Admin Panel</span>
        </Link>
        <div className="w-8" />
      </div>

      <div className="flex">
        <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;