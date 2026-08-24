const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const authGuard = require('../middleware/authGuard');

// GET /api/v1/auth/me (Protected) - Live Authenticated Profile
router.get('/me', authGuard, async (req, res, next) => {
  try {
    const user = req.member;
    res.status(200).json({
      success: true,
      member: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        membershipType: user.membershipType || (user.role === 'Trainer' ? 'platinum' : 'basic'),
        role: user.role,
        specialization: user.specialization || '',
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/register (Member Registration)
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, membershipType, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    // Check if member already exists
    const existing = await Member.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please login instead.',
      });
    }

    const member = await Member.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      password: password || 'password123',
      membershipType: membershipType || 'basic',
      role: 'Member',
    });

    const secret = process.env.JWT_SECRET || 'fitzone_secret_key_2026_exam';
    const token = jwt.sign(
      { id: member._id, email: member.email, role: member.role },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to FitZone.',
      token,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        membershipType: member.membershipType,
        role: member.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/auth/login (Unified Login for Member, Trainer, and Admin)
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const secret = process.env.JWT_SECRET || 'fitzone_secret_key_2026_exam';

    // 1. Try finding in Member collection (Members and Admins)
    const member = await Member.findOne({ email: cleanEmail });

    if (member) {
      if (password && member.password && password !== member.password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password',
        });
      }

      const token = jwt.sign(
        { id: member._id, email: member.email, role: member.role },
        secret,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        member: {
          id: member._id,
          name: member.name,
          email: member.email,
          phone: member.phone,
          membershipType: member.membershipType,
          role: member.role,
        },
      });
    }

    // 2. Try finding in Trainer collection (Trainers)
    const trainer = await Trainer.findOne({ email: cleanEmail });

    if (trainer) {
      if (password && trainer.password && password !== trainer.password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password',
        });
      }

      const token = jwt.sign(
        { id: trainer._id, email: trainer.email, role: 'Trainer' },
        secret,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful as Trainer',
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
      });
    }

    // If not found in either
    return res.status(401).json({
      success: false,
      message: 'No account found with this email. Please register first.',
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/auth/membership (Protected) - Upgrade / Update membership tier
router.patch('/membership', authGuard, async (req, res, next) => {
  try {
    const { membershipType } = req.body;

    if (!membershipType || !['basic', 'premium', 'platinum'].includes(membershipType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid membership type. Allowed: basic, premium, platinum',
      });
    }

    const member = await Member.findById(req.member._id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    member.membershipType = membershipType;
    await member.save();

    res.status(200).json({
      success: true,
      message: `Membership successfully updated to ${membershipType.toUpperCase()} plan!`,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        membershipType: member.membershipType,
        role: member.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
