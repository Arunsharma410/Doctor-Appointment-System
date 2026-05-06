import React from 'react';
import { useParams } from 'react-router-dom';

const DoctorDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">
        Doctor Details Page
      </h1>

      <p className="mt-4">
        Doctor ID: {id}
      </p>

      <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg">
        Book Appointment
      </button>
    </div>
  );
};

export default DoctorDetails;