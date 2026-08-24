const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');

const authGuard = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Missing or invalid Authorization Bearer token',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'fitzone_secret_key_2026_exam';

    const decoded = jwt.verify(token, secret);
    
    // Check Member collection first
    let user = await Member.findById(decoded.id).select('-password');
    
    // If not found in Member, check Trainer collection
    if (!user) {
      user = await Trainer.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Account not found',
      });
    }

    req.member = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Token verification failed',
      error: error.message,
    });
  }
};

module.exports = authGuard;
