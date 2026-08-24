const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const ClassBooking = require('../models/ClassBooking');

// GET /api/v1/admin/stats - Dashboard statistics
router.get('/stats', async (req, res, next) => {
  try {
    const totalMembers = await Member.countDocuments({ role: 'Member' });
    const totalTrainers = await Trainer.countDocuments();
    const totalBookings = await ClassBooking.countDocuments();
    const activeBookings = await ClassBooking.countDocuments({ status: 'booked' });
    const cancelledBookings = await ClassBooking.countDocuments({ status: 'cancelled' });
    const attendedBookings = await ClassBooking.countDocuments({ status: 'attended' });
    const availableTrainers = await Trainer.countDocuments({ available: true });

    res.status(200).json({
      success: true,
      stats: {
        totalMembers,
        totalTrainers,
        availableTrainers,
        totalBookings,
        activeBookings,
        cancelledBookings,
        attendedBookings,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/members - All members list
router.get('/members', async (req, res, next) => {
  try {
    const members = await Member.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/admin/bookings - All bookings
router.get('/bookings', async (req, res, next) => {
  try {
    const bookings = await ClassBooking.find()
      .populate('memberId', 'name email membershipType')
      .populate('trainerId', 'name specialization')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
