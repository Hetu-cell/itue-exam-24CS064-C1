const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Custom Global Request Logger Middleware
const requestLogger = require('./middleware/logger');
app.use(requestLogger);

// Import Middlewares & Routes
const authGuard = require('./middleware/authGuard');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

// API V1 Routes
app.use('/api/v1/auth', authRoutes);              // Public: login + register
app.use('/api/v1/trainers', trainerRoutes);        // Public: trainer listing
app.use('/api/v1/bookings', authGuard, bookingRoutes); // Protected: bookings
app.use('/api/v1/admin', authGuard, adminRoutes);  // Protected: admin panel

// Root Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'Active',
    system: 'FitZone Gym & Class Booking System API v1',
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler Middleware (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[FitZone Server Running]: http://localhost:${PORT}`);
});
