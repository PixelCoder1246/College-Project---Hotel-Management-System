const paymentService = require('./payment.service');
const { success, error } = require('../../utils/response.util');
const { validationResult } = require('express-validator');

/**
 * Generate invoice for a booking
 */
const generateInvoice = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await paymentService.getBookingForInvoice(bookingId);

    if (!booking) {
      return error(res, 'Booking not found', 404);
    }

    const invoice = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date(),
      customer: {
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone,
      },
      bookingDetails: {
        bookingId: booking.id,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        roomNumber: booking.room.roomNumber,
        roomType: booking.room.type,
      },
      amount: {
        subtotal: booking.totalPrice,
        tax: booking.totalPrice * 0.1, // 10% tax example
        total: booking.totalPrice * 1.1,
      },
      status: booking.status,
    };

    return success(res, invoice, 200, 'Invoice generated successfully');
  } catch (err) {
    console.error('Generate Invoice Error:', err);
    return error(res, 'Failed to generate invoice', 500);
  }
};

/**
 * Process a payment
 */
const processPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 400);
  }

  try {
    const { bookingId, amount, method, transactionId } = req.body;

    // Check if booking exists
    const booking = await paymentService.getBookingForInvoice(bookingId);
    if (!booking) {
      return error(res, 'Booking not found', 404);
    }

    // Mock payment processing logic
    // In a real scenario, you'd call a payment gateway API here (Stripe, Razorpay, etc.)
    const paymentStatus = 'COMPLETED'; // Mocking a successful payment

    const payment = await paymentService.createPayment({
      bookingId,
      amount,
      method,
      status: paymentStatus,
      transactionId:
        transactionId ||
        `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });

    return success(res, payment, 201, 'Payment processed successfully');
  } catch (err) {
    console.error('Process Payment Error:', err);
    return error(res, 'Failed to process payment', 500);
  }
};

/**
 * Get payment status for a booking
 */
const getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const payments = await paymentService.getPaymentsByBooking(bookingId);

    return success(
      res,
      payments,
      200,
      'Payment details retrieved successfully'
    );
  } catch (err) {
    console.error('Get Payment Status Error:', err);
    return error(res, 'Failed to retrieve payment details', 500);
  }
};

module.exports = {
  generateInvoice,
  processPayment,
  getPaymentStatus,
};
