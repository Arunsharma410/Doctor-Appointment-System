import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import DoctorCard from '../components/doctor/DoctorCard';
import {
  FaSearch,
  FaFilter,
  FaUserMd,
  FaTimes,
  FaStethoscope,
} from 'react-icons/fa';

const Doctors = () => {
  const location = useLocation();

  // Get query params from URL
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';
  const initialSpec = queryParams.get('specialization') || '';

  // States
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSpec, setSelectedSpec] = useState(initialSpec);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedFee, setSelectedFee] = useState('');

  // Specializations list
  const specializations = [
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Orthopedic',
    'Pediatrician',
    'Psychiatrist',
    'Gynecologist',
    'Ophthalmologist',
    'ENT Specialist',
    'Dentist',
    'General Physician',
    'Urologist',
    'Oncologist',
  ];

  // Fetch all doctors
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/doctors');
      if (response.data.success) {
        setDoctors(response.data.data);
        setFilteredDoctors(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedSpec, selectedCity, selectedExperience, selectedFee, doctors]);

  const applyFilters = () => {
    let filtered = [...doctors];

    // Search by name
    if (searchTerm) {
      filtered = filtered.filter((doc) =>
        doc.userId?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialization
    if (selectedSpec) {
      filtered = filtered.filter((doc) =>
        doc.specialization
          ?.toLowerCase()
          .includes(selectedSpec.toLowerCase())
      );
    }

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter((doc) =>
        doc.city?.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    // Filter by experience
    if (selectedExperience) {
      filtered = filtered.filter((doc) => {
        if (selectedExperience === '0-5') {
          return doc.experience >= 0 && doc.experience <= 5;
        } else if (selectedExperience === '5-10') {
          return doc.experience > 5 && doc.experience <= 10;
        } else if (selectedExperience === '10+') {
          return doc.experience > 10;
        }
        return true;
      });
    }

    // Filter by fee
    if (selectedFee) {
      filtered = filtered.filter((doc) => {
        if (selectedFee === '0-500') {
          return doc.fees >= 0 && doc.fees <= 500;
        } else if (selectedFee === '500-1000') {
          return doc.fees > 500 && doc.fees <= 1000;
        } else if (selectedFee === '1000+') {
          return doc.fees > 1000;
        }
        return true;
      });
    }

    setFilteredDoctors(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSpec('');
    setSelectedCity('');
    setSelectedExperience('');
    setSelectedFee('');
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm ||
    selectedSpec ||
    selectedCity ||
    selectedExperience ||
    selectedFee;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ======================== */}
      {/* PAGE HEADER */}
      {/* ======================== */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Doctor
          </h1>
          <p className="text-blue-100 text-lg mb-8">
            Search from {doctors.length}+ verified doctors
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-2 flex items-center shadow-lg">
              <FaSearch className="text-gray-400 ml-3 text-lg" />
              <input
                type="text"
                placeholder="Search by doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 text-gray-700 outline-none bg-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-600 mr-2"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================== */}
      {/* MAIN CONTENT */}
      {/* ======================== */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* ======================== */}
          {/* FILTERS SIDEBAR */}
          {/* ======================== */}
          <div className={`
            fixed inset-0 z-50 bg-white overflow-y-auto p-6
            md:relative md:inset-auto md:z-auto md:bg-transparent
            md:p-0 md:w-72 md:flex-shrink-0 md:block
            ${showFilters ? 'block' : 'hidden'}
          `}>

            {/* Mobile Close Button */}
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="text-xl font-bold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            {/* Filter Card */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">

              {/* Filter Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaFilter className="text-blue-600" />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-red-500 text-sm hover:text-red-600 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Specialization Filter */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  Specialization
                </label>
                <select
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter city name"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Experience Filter */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  Experience
                </label>
                <div className="space-y-2">
                  {[
                    { value: '', label: 'Any Experience' },
                    { value: '0-5', label: '0 - 5 years' },
                    { value: '5-10', label: '5 - 10 years' },
                    { value: '10+', label: '10+ years' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={option.value}
                        checked={selectedExperience === option.value}
                        onChange={(e) =>
                          setSelectedExperience(e.target.value)
                        }
                        className="text-blue-600"
                      />
                      <span className="text-gray-600 text-sm">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fee Range Filter */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  Consultation Fee
                </label>
                <div className="space-y-2">
                  {[
                    { value: '', label: 'Any Fee' },
                    { value: '0-500', label: 'Under ₹500' },
                    { value: '500-1000', label: '₹500 - ₹1000' },
                    { value: '1000+', label: 'Above ₹1000' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="fee"
                        value={option.value}
                        checked={selectedFee === option.value}
                        onChange={(e) => setSelectedFee(e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="text-gray-600 text-sm">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Button (Mobile) */}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 md:hidden"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* ======================== */}
          {/* DOCTORS LIST */}
          {/* ======================== */}
          <div className="flex-1">

            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {loading
                    ? 'Loading...'
                    : `${filteredDoctors.length} Doctors Found`}
                </h2>
                {hasActiveFilters && (
                  <p className="text-gray-500 text-sm mt-1">
                    Filtered results
                  </p>
                )}
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="md:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <FaFilter />
                Filters
                {hasActiveFilters && (
                  <span className="bg-white text-blue-600 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                    !
                  </span>
                )}
              </button>
            </div>

            {/* Active Filters Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    Search: {searchTerm}
                    <button onClick={() => setSearchTerm('')}>
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                {selectedSpec && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {selectedSpec}
                    <button onClick={() => setSelectedSpec('')}>
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                {selectedCity && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {selectedCity}
                    <button onClick={() => setSelectedCity('')}>
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                {selectedExperience && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    Exp: {selectedExperience} yrs
                    <button onClick={() => setSelectedExperience('')}>
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
                {selectedFee && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    Fee: ₹{selectedFee}
                    <button onClick={() => setSelectedFee('')}>
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
                  >
                    <div className="bg-gray-200 h-32"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDoctors.length > 0 ? (
              /* Doctors Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-20 bg-white rounded-xl shadow-md">
                <FaStethoscope className="text-gray-300 text-6xl mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">
                  No Doctors Found
                </h3>
                <p className="text-gray-500 mb-6">
                  {hasActiveFilters
                    ? 'No doctors match your filters. Try different filters.'
                    : 'No approved doctors available yet.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;