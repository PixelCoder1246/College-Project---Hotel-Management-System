const { body, query } = require('express-validator');

const createBookingValidator = [
  body('roomId')
    .notEmpty()
    .withMessage('Room ID is required')
    .isUUID()
    .withMessage('Invalid room ID'),
  
  body('checkIn')
    .notEmpty()
    .withMessage('Check-in date is required')
    .isISO8601()
    .withMessage('Invalid check-in date format')
    .custom((value) => {
      if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
        throw new Error('Check-in date cannot be in the past');
      }
      return true;
    }),
  
  body('checkOut')
    .notEmpty()
    .withMessage('Check-out date is required')
    .isISO8601()
    .withMessage('Invalid check-out date format')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.checkIn)) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),
];

const updateBookingValidator = [
  body('checkIn')
    .optional()
    .isISO8601()
    .withMessage('Invalid check-in date format')
    .custom((value) => {
      if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
        throw new Error('Check-in date cannot be in the past');
      }
      return true;
    }),
  
  body('checkOut')
    .optional()
    .isISO8601()
    .withMessage('Invalid check-out date format')
    .custom((value, { req }) => {
      const checkIn = req.body.checkIn || req.booking?.checkIn;
      if (checkIn && new Date(value) <= new Date(checkIn)) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),
  
  body('status')
    .optional()
    .isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
    .withMessage('Invalid booking status'),
];

const checkAvailabilityValidator = [
  query('roomId')
    .notEmpty()
    .withMessage('Room ID is required')
    .isUUID()
    .withMessage('Invalid room ID'),
  
  query('checkIn')
    .notEmpty()
    .withMessage('Check-in date is required')
    .isISO8601()
    .withMessage('Invalid check-in date format'),
  
  query('checkOut')
    .notEmpty()
    .withMessage('Check-out date is required')
    .isISO8601()
    .withMessage('Invalid check-out date format')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.query.checkIn)) {
        throw new Error('Check-out date must be after check-in date');
      }
      return true;
    }),
];

module.exports = {
  createBookingValidator,
  updateBookingValidator,
  checkAvailabilityValidator,
};
