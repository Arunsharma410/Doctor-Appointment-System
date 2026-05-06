import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const DoctorDetails = () => {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

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
      toast.error('Failed to load doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      return toast.error('Please select date and time');
    }

    try {
      const response = await axios.post('/appointments/book', {
        doctorId: id,
        date: selectedDate,
        timeSlot: selectedTime,
      });

      if (response.data.success) {
        toast.success('Appointment booked successfully!');
      }
    } catch (error) {
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

        <h1 className="text-3xl font-bold mb-2">
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

        {/* Date Picker */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">
            Select Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        {/* Time Slots */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">
            Select Time Slot
          </label>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setSelectedTime(slot)}
                className={`py-2 rounded-lg border ${
                  selectedTime === slot
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Booking Button */}
        <button
          onClick={handleBooking}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorDetails;