import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import {
  FaUserMd,
  FaCalendarCheck,
  FaStar,
  FaArrowRight,
  FaHeartbeat,
  FaBrain,
  FaBone,
  FaEye,
  FaTooth,
  FaChild,
  FaAllergies,
  FaStethoscope,
  FaCheckCircle,
  FaSearch,
  FaClock,
  FaShieldAlt,
} from 'react-icons/fa';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch featured doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/doctors');
        if (response.data.success) {
          // Show only first 3 doctors
          setDoctors(response.data.data.slice(0, 3));
        }
      } catch (error) {
        console.log('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Specializations data
  const specializations = [
    {
      name: 'Cardiologist',
      icon: <FaHeartbeat className="text-3xl" />,
      color: 'bg-red-100 text-red-600',
      hoverColor: 'hover:bg-red-600',
    },
    {
      name: 'Neurologist',
      icon: <FaBrain className="text-3xl" />,
      color: 'bg-purple-100 text-purple-600',
      hoverColor: 'hover:bg-purple-600',
    },
    {
      name: 'Orthopedic',
      icon: <FaBone className="text-3xl" />,
      color: 'bg-yellow-100 text-yellow-600',
      hoverColor: 'hover:bg-yellow-600',
    },
    {
      name: 'Ophthalmologist',
      icon: <FaEye className="text-3xl" />,
      color: 'bg-blue-100 text-blue-600',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      name: 'Dentist',
      icon: <FaTooth className="text-3xl" />,
      color: 'bg-green-100 text-green-600',
      hoverColor: 'hover:bg-green-600',
    },
    {
      name: 'Pediatrician',
      icon: <FaChild className="text-3xl" />,
      color: 'bg-pink-100 text-pink-600',
      hoverColor: 'hover:bg-pink-600',
    },
    {
      name: 'Dermatologist',
      icon: <FaAllergies className="text-3xl" />,
      color: 'bg-orange-100 text-orange-600',
      hoverColor: 'hover:bg-orange-600',
    },
    {
      name: 'General Physician',
      icon: <FaStethoscope className="text-3xl" />,
      color: 'bg-teal-100 text-teal-600',
      hoverColor: 'hover:bg-teal-600',
    },
  ];

  // How it works steps
  const steps = [
    {
      step: '01',
      title: 'Search Doctor',
      description:
        'Search for doctors by specialization, city or name. Find the best doctor for your needs.',
      icon: <FaSearch className="text-3xl text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      step: '02',
      title: 'Book Appointment',
      description:
        'Choose your preferred date and time slot. Book appointment in just a few clicks.',
      icon: <FaCalendarCheck className="text-3xl text-green-600" />,
      color: 'bg-green-50',
    },
    {
      step: '03',
      title: 'Get Confirmation',
      description:
        'Receive instant confirmation. Doctor will confirm your appointment shortly.',
      icon: <FaCheckCircle className="text-3xl text-purple-600" />,
      color: 'bg-purple-50',
    },
    {
      step: '04',
      title: 'Visit Doctor',
      description:
        'Visit the doctor at the scheduled time. Get the best healthcare service.',
      icon: <FaUserMd className="text-3xl text-orange-600" />,
      color: 'bg-orange-50',
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Patient',
      comment:
        'DocBook made it so easy to find and book a cardiologist. Got an appointment within 2 hours!',
      rating: 5,
      avatar: 'RS',
      color: 'bg-blue-500',
    },
    {
      name: 'Priya Patel',
      role: 'Patient',
      comment:
        'Amazing platform! I found the best dermatologist in my city. Highly recommended.',
      rating: 5,
      avatar: 'PP',
      color: 'bg-pink-500',
    },
    {
      name: 'Amit Kumar',
      role: 'Patient',
      comment:
        'Very easy to use. Booked an appointment for my child with a pediatrician in minutes.',
      rating: 5,
      avatar: 'AK',
      color: 'bg-green-500',
    },
  ];

  return (
    <div>
      {/* ======================== */}
      {/* HERO SECTION */}
      {/* ======================== */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Left Side - Text */}
            <div>
              <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                🏥 Trusted Healthcare Platform
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Book Doctor
                <span className="text-yellow-400"> Appointments </span>
                Easily & Quickly
              </h1>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Connect with the best doctors in your city. 
                Book appointments online, get confirmed instantly 
                and receive quality healthcare.
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-xl p-2 flex items-center shadow-lg mb-8">
                <FaSearch className="text-gray-400 ml-3 text-lg" />
                <input
                  type="text"
                  placeholder="Search doctor by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 text-gray-700 outline-none bg-transparent"
                />
                <Link
                  to={`/doctors?search=${searchTerm}`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                >
                  Search
                </Link>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/doctors"
                  className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors flex items-center gap-2"
                >
                  Find Doctors
                  <FaArrowRight />
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Register Free
                </Link>
              </div>
            </div>

            {/* Right Side - Image/Illustration */}
            <div className="hidden md:flex justify-center">
              <div className="relative">
                {/* Main circle */}
                <div className="w-80 h-80 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaUserMd className="text-white text-9xl" />
                </div>

                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 bg-white text-gray-800 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500 text-xl" />
                    <div>
                      <p className="font-bold text-sm">Appointment Confirmed</p>
                      <p className="text-xs text-gray-500">Today, 10:00 AM</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white text-gray-800 rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400 text-xl" />
                    <div>
                      <p className="font-bold text-sm">4.9 Rating</p>
                      <p className="text-xs text-gray-500">1000+ Reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== */}
      {/* STATS SECTION */}
      {/* ======================== */}
      <section className="bg-white py-12 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                number: '500+',
                label: 'Doctors',
                icon: <FaUserMd className="text-blue-600 text-3xl" />,
              },
              {
                number: '10,000+',
                label: 'Patients',
                icon: <FaHeartbeat className="text-red-500 text-3xl" />,
              },
              {
                number: '50,000+',
                label: 'Appointments',
                icon: (
                  <FaCalendarCheck className="text-green-500 text-3xl" />
                ),
              },
              {
                number: '4.9/5',
                label: 'Rating',
                icon: <FaStar className="text-yellow-400 text-3xl" />,
              },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                {stat.icon}
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {stat.number}
                </h3>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== */}
      {/* SPECIALIZATIONS SECTION */}
      {/* ======================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Find by Specialization
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Browse doctors by their area of expertise and 
              find the right specialist for your needs
            </p>
          </div>

          {/* Specializations Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {specializations.map((spec, index) => (
              <Link
                key={index}
                to={`/doctors?specialization=${spec.name}`}
                className={`${spec.color} p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
              >
                <div className="flex justify-center mb-3">
                  {spec.icon}
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-current">
                  {spec.name}
                </h3>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-10">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              View All Doctors
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================== */}
      {/* HOW IT WORKS SECTION */}
      {/* ======================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">
              Book an appointment in 4 simple steps
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <div key={index} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-blue-200 z-0 transform -translate-x-1/2"></div>
                )}

                <div
                  className={`${item.color} rounded-xl p-6 text-center relative z-10`}
                >
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    {item.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== */}
      {/* FEATURED DOCTORS SECTION */}
      {/* ======================== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Featured Doctors
            </h2>
            <p className="text-gray-600 text-lg">
              Meet our top rated healthcare professionals
            </p>
          </div>

          {/* Doctors Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Doctor Card Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaUserMd className="text-blue-600 text-3xl" />
                    </div>
                    <h3 className="text-white font-bold text-lg">
                      {doctor.userId?.name}
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {doctor.specialization}
                    </p>
                  </div>

                  {/* Doctor Card Body */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span className="font-semibold text-gray-700">
                          {doctor.rating || '4.5'}
                        </span>
                        <span className="text-gray-500 text-sm">
                          ({doctor.totalReviews || '0'} reviews)
                        </span>
                      </div>
                      <span className="text-green-600 font-semibold text-sm">
                        Available
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FaClock className="text-blue-500" />
                        <span>{doctor.experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FaShieldAlt className="text-blue-500" />
                        <span>{doctor.qualifications || 'MBBS, MD'}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-500 text-sm">
                          Consultation
                        </span>
                        <p className="text-blue-600 font-bold text-lg">
                          ₹{doctor.fees}
                        </p>
                      </div>
                      <Link
                        to={`/doctors/${doctor._id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FaUserMd className="text-gray-300 text-6xl mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No doctors available yet
              </p>
              <Link
                to="/register"
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Register as Doctor
              </Link>
            </div>
          )}

          {/* View All Button */}
          {doctors.length > 0 && (
            <div className="text-center mt-10">
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-600 hover:text-white transition-colors font-semibold"
              >
                View All Doctors
                <FaArrowRight />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ======================== */}
      {/* TESTIMONIALS SECTION */}
      {/* ======================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Patients Say
            </h2>
            <p className="text-gray-600 text-lg">
              Real reviews from real patients
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-600 italic mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className={`${testimonial.color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== */}
      {/* CALL TO ACTION SECTION */}
      {/* ======================== */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Book Your Appointment?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of patients who trust DocBook 
            for their healthcare needs. 
            Register today and get started!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-xl font-bold hover:bg-yellow-300 transition-colors text-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/doctors"
              className="border-2 border-white text-white px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-colors text-lg"
            >
              Browse Doctors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;