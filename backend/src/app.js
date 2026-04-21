const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const roomRoutes = require('./modules/room/room.routes');
const bookingRoutes = require('./modules/booking/booking.routes');

const app = express();

app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:5174',
    ].filter(Boolean),
    credentials: true,
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests. Please try again later.',
  },
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Hotel Management System API',
    version: '3.0.0',
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.method} ${req.originalUrl} on this server.`,
  });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error.',
  });
});

module.exports = app;
