const prisma = require('../../config/db');

/**
 * Get booking details for invoice generation
 * @param {string} bookingId
 * @returns {Promise<Object>}
 */
const getBookingForInvoice = async (bookingId) => {
  return await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      room: {
        select: {
          roomNumber: true,
          type: true,
          price: true,
        },
      },
    },
  });
};

/**
 * Create a new payment record
 * @param {Object} paymentData
 * @returns {Promise<Object>}
 */
const createPayment = async (paymentData) => {
  const { bookingId, amount, method, status, transactionId } = paymentData;

  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        bookingId,
        amount,
        method,
        status: status || 'COMPLETED',
        transactionId,
      },
    });

    // If payment is completed, update booking status
    if (status === 'COMPLETED' || !status) {
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });
    }

    return payment;
  });
};

/**
 * Get payments for a booking
 * @param {string} bookingId
 * @returns {Promise<Array>}
 */
const getPaymentsByBooking = async (bookingId) => {
  return await prisma.payment.findMany({
    where: { bookingId },
    orderBy: { createdAt: 'desc' },
  });
};

module.exports = {
  getBookingForInvoice,
  createPayment,
  getPaymentsByBooking,
};
