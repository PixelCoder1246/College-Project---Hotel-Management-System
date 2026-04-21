const express = require('express');
const {
  checkAvailability,
  createBooking,
  updateBooking,
  cancelBooking,
  getBookingById
} = require('./booking.controller');
const {
  createBookingValidator,
  updateBookingValidator,
  checkAvailabilityValidator
} = require('./booking.validator');
const { authenticate } = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');

const router = express.Router();

router.use(authenticate);

router.get('/check-availability', checkAvailabilityValidator, checkAvailability);
router.post('/', createBookingValidator, createBooking);
router.get('/:id', getBookingById);
router.patch('/:id', updateBookingValidator, updateBooking);
router.delete('/:id', cancelBooking);

module.exports = router;
