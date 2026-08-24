const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Trainer = require('../models/Trainer');
const ClassBooking = require('../models/ClassBooking');
const authGuard = require('../middleware/authGuard');

// GET /api/v1/trainers (Public) - List all trainers
router.get('/', async (req, res, next) => {
  try {
    const trainers = await Trainer.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: trainers.length,
      trainers,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/trainers/me/portal (Protected) - Trainer Dashboard Data
router.get('/me/portal', authGuard, async (req, res, next) => {
  try {
    const trainerId = req.member._id;
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer profile not found',
      });
    }

    // 1. Bookings assigned specifically to THIS trainer
    const myBookings = await ClassBooking.find({ trainerId })
      .populate('memberId', 'name email phone membershipType')
      .sort({ createdAt: -1 });

    // 2. Bookings assigned to OTHER trainers in the gym
    const otherBookings = await ClassBooking.find({ trainerId: { $ne: trainerId } })
      .populate('memberId', 'name email membershipType')
      .populate('trainerId', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(10);

    const stats = {
      totalAssigned: myBookings.length,
      activeSessions: myBookings.filter((b) => b.status === 'booked').length,
      completedSessions: myBookings.filter((b) => b.status === 'attended').length,
      cancelledSessions: myBookings.filter((b) => b.status === 'cancelled').length,
    };

    res.status(200).json({
      success: true,
      trainer,
      stats,
      myBookings,
      otherBookings,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/trainers/me/toggle-availability (Protected) - Trainer self-availability toggle
router.patch('/me/toggle-availability', authGuard, async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.member._id);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer profile not found',
      });
    }

    trainer.available = !trainer.available;
    await trainer.save();

    res.status(200).json({
      success: true,
      message: `Your availability is now set to ${trainer.available ? '🟢 Available for Bookings' : '🔴 Fully Booked (Unavailable)'}`,
      available: trainer.available,
      trainer,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/trainers (Public/Protected) - Register a new Trainer
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, password, specialization, available } = req.body;

    if (!name || !specialization) {
      return res.status(400).json({
        success: false,
        message: 'Trainer name and specialization are required',
      });
    }

    if (email) {
      const existing = await Trainer.findOne({ email: email.toLowerCase().trim() });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A trainer with this email already exists. Please login instead.',
        });
      }
    }

    const trainer = await Trainer.create({
      name: name.trim(),
      email: email ? email.toLowerCase().trim() : '',
      phone: phone ? phone.trim() : '',
      password: password || 'password123',
      specialization: specialization.trim(),
      available: available !== undefined ? Boolean(available) : true,
      role: 'Trainer',
    });

    const secret = process.env.JWT_SECRET || 'fitzone_secret_key_2026_exam';
    const token = jwt.sign(
      { id: trainer._id, email: trainer.email, role: 'Trainer' },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: `Trainer "${trainer.name}" registered successfully!`,
      token,
      member: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone,
        specialization: trainer.specialization,
        membershipType: 'platinum',
        role: 'Trainer',
      },
      trainer,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/trainers/:id/availability - Toggle or update trainer availability by ID
router.patch('/:id/availability', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    const trainer = await Trainer.findById(id);
    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found',
      });
    }

    trainer.available = available !== undefined ? Boolean(available) : !trainer.available;
    await trainer.save();

    res.status(200).json({
      success: true,
      message: `Trainer availability updated to ${trainer.available ? 'Available' : 'Fully Booked'}`,
      trainer,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/trainers/:id - Delete a trainer
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const trainer = await Trainer.findByIdAndDelete(id);

    if (!trainer) {
      return res.status(404).json({
        success: false,
        message: 'Trainer not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Trainer "${trainer.name}" removed successfully`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
