const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Trainer name is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      default: 'password123',
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      default: 'Trainer',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trainer', trainerSchema);
