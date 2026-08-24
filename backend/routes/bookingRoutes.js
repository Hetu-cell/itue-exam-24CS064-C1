const express = require('express');
const router = express.Router();
const ClassBooking = require('../models/ClassBooking');
const Trainer = require('../models/Trainer');

// POST /api/v1/bookings (Protected) - Create new class booking
router.post('/', async (req, res, next) => {
  try {
    const { trainerId, className, date, timeSlot, status } = req.body;
    const memberId = req.member._id || req.body.memberId;

    if (!trainerId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a trainer',
      });
    }

    // Check if trainer exists and is available
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found',
      });
    }

    if (!trainer.available) {
      return res.status(400).json({
        success: false,
        message: `Trainer "${trainer.name}" is currently fully booked and cannot accept new reservations. Please choose an available trainer.`,
      });
    }

    // Enforce Membership Tier Booking Quotas
    const memberType = req.member.membershipType || 'basic';
    const activeBookingCount = await ClassBooking.countDocuments({
      memberId,
      status: 'booked',
    });

    const tierLimits = { basic: 1, premium: 3, platinum: Infinity };
    const maxAllowed = tierLimits[memberType] || 1;

    if (activeBookingCount >= maxAllowed) {
      return res.status(400).json({
        success: false,
        message: `[${memberType.toUpperCase()} Tier Limit]: You already have ${activeBookingCount} active reservation. Your ${memberType} plan allows a maximum of ${maxAllowed} active booking at a time. Please upgrade to Premium or Platinum for more slots!`,
      });
    }

    const booking = new ClassBooking({
      memberId,
      trainerId,
      className,
      date,
      timeSlot,
      status: status || 'booked',
    });

    const savedBooking = await booking.save();

    // Populate before sending response
    await savedBooking.populate('memberId', 'name email');
    await savedBooking.populate('trainerId', 'name specialization');

    res.status(201).json({
      success: true,
      message: 'Class booking created successfully',
      booking: savedBooking,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/bookings/my (Protected) - Return logged-in member's bookings
router.get('/my', async (req, res, next) => {
  try {
    const memberId = req.member._id;

    const bookings = await ClassBooking.find({ memberId })
      .populate('memberId', 'name email')
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

// PATCH /api/v1/bookings/:id/status (Protected) - Update booking status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['booked', 'attended', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value. Must be one of: booked, attended, cancelled',
      });
    }

    const booking = await ClassBooking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking.status = status;
    await booking.save();

    await booking.populate('memberId', 'name email');
    await booking.populate('trainerId', 'name specialization');

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
