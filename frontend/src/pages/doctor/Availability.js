import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';
import DoctorLayout from '../../components/doctor/DoctorLayout';
import {
  FaClock,
  FaPlus,
  FaTrash,
  FaSave,
} from 'react-icons/fa';

const Availability = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM',
    '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM',
    '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM',
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/doctors/my-profile');
      if (response.data.success) {
        setAvailability(response.data.data.availability || []);
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a day
  const addDay = (day) => {
    const exists = availability.find((a) => a.day === day);
    if (exists) {
      toast.error(`${day} already added`);
      return;
    }
    setAvailability([...availability, { day, slots: [] }]);
  };

  // Remove a day
  const removeDay = (day) => {
    setAvailability(availability.filter((a) => a.day !== day));
  };

  // Toggle time slot
  const toggleSlot = (day, slot) => {
    setAvailability(
      availability.map((avail) => {
        if (avail.day === day) {
          const slots = avail.slots.includes(slot)
            ? avail.slots.filter((s) => s !== slot)
            : [...avail.slots, slot];
          return { ...avail, slots };
        }
        return avail;
      })
    );
  };

  // Save availability
  const handleSave = async () => {
    // Check all days have at least one slot
    const emptyDays = availability.filter(
      (a) => a.slots.length === 0
    );
    if (emptyDays.length > 0) {
      toast.error(
        `Please add slots for: ${emptyDays.map((d) => d.day).join(', ')}`
      );
      return;
    }

    setSaving(true);
    try {
      const response = await axios.put('/doctors/availability', {
        availability,
      });
      if (response.data.success) {
        toast.success('Availability saved successfully!');
      }
    } catch (error) {
      toast.error('Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DoctorLayout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>

      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Availability Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Set your working days and time slots
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || availability.length === 0}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <FaSave />
              Save
            </>
          )}
        </button>
      </div>

      {/* Add Day Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaPlus className="text-green-600" />
          Add Working Days
        </h2>
        <div className="flex flex-wrap gap-3">
          {days.map((day) => {
            const isAdded = availability.find((a) => a.day === day);
            return (
              <button
                key={day}
                onClick={() => addDay(day)}
                disabled={!!isAdded}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  isAdded
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                }`}
              >
                {day}
                {isAdded && ' ✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Settings */}
      {availability.length > 0 ? (
        <div className="space-y-4">
          {availability.map((avail) => (
            <div
              key={avail.day}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {/* Day Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaClock className="text-green-600" />
                  {avail.day}
                  <span className="text-sm font-normal text-gray-500">
                    ({avail.slots.length} slots selected)
                  </span>
                </h3>
                <button
                  onClick={() => removeDay(avail.day)}
                  className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                >
                  <FaTrash />
                  Remove Day
                </button>
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => toggleSlot(avail.day, slot)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                      avail.slots.includes(slot)
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              {/* Selected Slots Summary */}
              {avail.slots.length > 0 && (
                <div className="mt-4 bg-green-50 rounded-lg p-3">
                  <p className="text-green-700 text-sm font-medium mb-2">
                    Selected slots:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {avail.slots.map((slot) => (
                      <span
                        key={slot}
                        className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FaClock className="text-gray-300 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            No Days Added
          </h3>
          <p className="text-gray-500">
            Click on days above to add your working schedule
          </p>
        </div>
      )}
    </DoctorLayout>
  );
};

export default Availability;