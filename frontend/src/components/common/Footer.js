import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaUserMd className="text-blue-400 text-2xl" />
              <span className="text-xl font-bold">DocBook</span>
            </div>
            <p className="text-gray-400 text-sm">
              Book appointments with the best doctors near you. 
              Quick, easy and reliable healthcare.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/doctors"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Register
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Specializations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Specializations</h3>
            <ul className="space-y-2">
              {[
                'Cardiologist',
                'Dermatologist',
                'Neurologist',
                'Orthopedic',
                'Pediatrician',
              ].map((spec) => (
                <li key={spec}>
                  <Link
                    to={`/doctors?specialization=${spec}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {spec}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <FaPhone className="text-blue-400" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <FaEnvelope className="text-blue-400" />
                <span>support@docbook.com</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <FaMapMarkerAlt className="text-blue-400" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 DocBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;