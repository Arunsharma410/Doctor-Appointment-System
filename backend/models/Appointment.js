const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },

    date: {
      type: String,
      required: [true, 'Please provide appointment date'],
    },

    timeSlot: {
      type: String,
      required: [true, 'Please provide time slot'],
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },

    fees: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },

    paymentId: {
      type: String,
      default: '',
    },

    notes: {
      type: String,
      default: '',
    },

    cancelReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);