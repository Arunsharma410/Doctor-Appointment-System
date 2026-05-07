import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartPulse, Menu, X, User } from 'lucide-react';
import { Button } from '../ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'doctor') return '/doctor/dashboard';
    if (user?.role === 'patient') return '/patient/dashboard';
    return '/';
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 fixed w-full top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <HeartPulse className="text-primary h-6 w-6" />
            <span className="text-xl font-bold text-slate-900 tracking-tight">DocBook</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/doctors" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Find Doctors
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to={getDashboardLink()} className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 bg-white absolute top-16 left-0 w-full px-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-sm font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/doctors" className="text-sm font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
                Find Doctors
              </Link>

              {user ? (
                <>
                  <Link to={getDashboardLink()} className="text-sm font-medium text-slate-600" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-slate-100">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;