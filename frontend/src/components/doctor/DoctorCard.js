import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserMd,
  FaStar,
  FaClock,
  FaMapMarkerAlt,
  FaHospital,
  FaGraduationCap,
} from 'react-icons/fa';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">

      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6">
        <div className="flex items-center gap-4">

          {/* Doctor Avatar */}
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center flex-shrink-0">
            {doctor.userId?.profilePhoto ? (
              <img
                src={doctor.userId.profilePhoto}
                alt={doctor.userId?.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <FaUserMd className="text-blue-600 text-3xl" />
            )}
          </div>

          {/* Doctor Basic Info */}
          <div className="text-white">
            <h3 className="text-xl font-bold">
              {doctor.userId?.name}
            </h3>
            <p className="text-blue-100 font-medium">
              {doctor.specialization}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="text-sm font-medium">
                {doctor.rating || '4.5'}
              </span>
              <span className="text-blue-200 text-sm">
                ({doctor.totalReviews || '0'} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6">

        {/* Doctor Details */}
        <div className="space-y-3 mb-6">

          {/* Experience */}
          <div className="flex items-center gap-3 text-gray-600">
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
              <FaClock className="text-blue-600 text-sm" />
            </div>
            <span className="text-sm">
              {doctor.experience} years experience
            </span>
          </div>

          {/* Qualifications */}
          {doctor.qualifications && (
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                <FaGraduationCap className="text-green-600 text-sm" />
              </div>
              <span className="text-sm">
                {doctor.qualifications}
              </span>
            </div>
          )}

          {/* Hospital */}
          {doctor.hospital && (
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                <FaHospital className="text-purple-600 text-sm" />
              </div>
              <span className="text-sm">
                {doctor.hospital}
              </span>
            </div>
          )}

          {/* City */}
          {doctor.city && (
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="text-orange-600 text-sm" />
              </div>
              <span className="text-sm">{doctor.city}</span>
            </div>
          )}
        </div>

        {/* Availability Badge */}
        <div className="flex flex-wrap gap-2 mb-4">
          {doctor.availability && doctor.availability.length > 0 ? (
            doctor.availability.slice(0, 3).map((avail, index) => (
              <span
                key={index}
                className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-medium"
              >
                {avail.day}
              </span>
            ))
          ) : (
            <span className="bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded-full">
              Schedule not set
            </span>
          )}
        </div>

        {/* Fee and Book Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-gray-500 text-xs">Consultation Fee</p>
            <p className="text-blue-600 font-bold text-xl">
              ₹{doctor.fees}
            </p>
          </div>
          <Link
            to={`/doctors/${doctor._id}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;