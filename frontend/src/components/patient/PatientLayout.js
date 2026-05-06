import React, { useState } from 'react';
import PatientSidebar from './PatientSidebar';
import { FaBars, FaUserMd } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PatientLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-600 text-2xl"
        >
          <FaBars />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <FaUserMd className="text-blue-600 text-xl" />
          <span className="font-bold text-blue-600">DocBook</span>
        </Link>
        <div className="w-8" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <PatientSidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PatientLayout;