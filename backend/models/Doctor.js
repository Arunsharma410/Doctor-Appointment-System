const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    specialization: {
      type: String,
      required: [true, 'Please enter specialization'],
      trim: true,
    },

    experience: {
      type: Number,
      required: [true, 'Please enter years of experience'],
      default: 0,
    },

    fees: {
      type: Number,
      required: [true, 'Please enter consultation fees'],
      default: 0,
    },

    bio: {
      type: String,
      default: '',
    },

    city: {
      type: String,
      default: '',
    },

    hospital: {
      type: String,
      default: '',
    },

    qualifications: {
      type: String,
      default: '',
    },

    availability: [
      {
        day: {
          type: String,
          enum: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
        },
        slots: [String],
        // slots example: ['9:00 AM', '10:00 AM', '11:00 AM']
      },
    ],

    isApproved: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);