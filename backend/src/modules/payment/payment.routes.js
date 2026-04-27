const express = require('express');
const {
  generateInvoice,
  processPayment,
  getPaymentStatus,
} = require('./payment.controller');
const {
  processPaymentValidator,
  getPaymentValidator,
} = require('./payment.validator');
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

// Generate invoice for a booking
router.get('/invoice/:bookingId', getPaymentValidator, generateInvoice);

// Process and store payment
router.post('/process', processPaymentValidator, processPayment);

// Get payment status for a booking
router.get('/booking/:bookingId', getPaymentValidator, getPaymentStatus);

module.exports = router;
