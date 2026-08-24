const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    password: {
      type: String,
      default: 'password123',
    },
    membershipType: {
      type: String,
      enum: {
        values: ['basic', 'premium', 'platinum'],
        message: '{VALUE} is not a valid membership type. Allowed: basic, premium, platinum',
      },
      default: 'basic',
    },
    role: {
      type: String,
      enum: ['Member', 'Trainer', 'Admin'],
      default: 'Member',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);
