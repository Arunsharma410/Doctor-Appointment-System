import React, { useState } from 'react';
import PatientSidebar from './PatientSidebar';
import { FaBars } from 'react-icons/fa';
import { HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

const PatientLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 w-full bg-white shadow-sm px-4 py-3 flex items-center justify-between z-20">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <FaBars className="text-slate-600 text-xl" />
        </Button>
        <Link to="/" className="flex items-center gap-2">
          <HeartPulse className="text-primary h-6 w-6" />
          <span className="font-bold text-primary">DocBook</span>
        </Link>
        <div className="w-8" />
      </div>

      <PatientSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 min-h-screen pt-16 md:pt-0">
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;