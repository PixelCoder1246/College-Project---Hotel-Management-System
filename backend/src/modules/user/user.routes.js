const express = require('express');
const {
  getProfile,
  updateProfile,
  getBookingHistory,
} = require('./user.controller');
const { updateProfileValidator } = require('./user.validator');
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.patch('/profile', updateProfileValidator, updateProfile);
router.get('/bookings', getBookingHistory);

module.exports = router;
