import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const DoctorDetails = () => {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctor();
  }, []);

  const fetchDoctor = async () => {
    try {
      const response = await axios.get(`/doctors/${id}`);

      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to load doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    try {
      const response = await axios.post('/appointments/book', {
        doctorId: id,
        date: new Date().toISOString().split('T')[0],
        timeSlot: '10:00 AM',
      });

      if (response.data.success) {
        toast.success('Appointment booked successfully!');
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || 'Booking failed'
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      <div className="bg-white rounded-xl shadow-md p-8">

        <h1 className="text-3xl font-bold mb-4">
          {doctor?.userId?.name}
        </h1>

        <p className="text-gray-600 mb-2">
          {doctor?.specialization}
        </p>

        <p className="text-gray-600 mb-2">
          {doctor?.experience} years experience
        </p>

        <p className="text-blue-600 text-2xl font-bold mb-6">
          ₹{doctor?.fees}
        </p>

        <button
          onClick={handleBooking}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorDetails;