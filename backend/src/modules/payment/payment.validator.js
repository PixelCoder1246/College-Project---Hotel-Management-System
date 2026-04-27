const { body, param } = require('express-validator');

const processPaymentValidator = [
  body('bookingId')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isUUID()
    .withMessage('Invalid booking ID'),

  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),

  body('method')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL', 'CASH', 'UPI'])
    .withMessage('Invalid payment method'),

  body('transactionId')
    .optional()
    .isString()
    .withMessage('Transaction ID must be a string'),
];

const getPaymentValidator = [
  param('bookingId')
    .notEmpty()
    .withMessage('Booking ID is required')
    .isUUID()
    .withMessage('Invalid booking ID'),
];

module.exports = {
  processPaymentValidator,
  getPaymentValidator,
};
