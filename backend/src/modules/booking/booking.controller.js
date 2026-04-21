const { validationResult } = require('express-validator');
const bookingService = require('./booking.service');
const { success, error } = require('../../utils/response.util');

const checkAvailability = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 422);
  }

  try {
    const { roomId, checkIn, checkOut } = req.query;
    const isAvailable = await bookingService.checkAvailability(roomId, checkIn, checkOut);
    return success(res, { isAvailable }, 200, isAvailable ? 'Room is available' : 'Room is not available');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const createBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 422);
  }

  try {
    const bookingData = {
      userId: req.user.id,
      ...req.body
    };
    const booking = await bookingService.createBooking(bookingData);
    return success(res, { booking }, 201, 'Booking created successfully');
  } catch (err) {
    return error(res, err.message, err.message === 'Room is not available for the selected dates' ? 400 : 500);
  }
};

const updateBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 422);
  }

  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    return success(res, { booking }, 200, 'Booking updated successfully');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const cancelBooking = async (req, res) => {
  try {
    await bookingService.cancelBooking(req.params.id);
    return success(res, null, 200, 'Booking cancelled successfully');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id);
    if (!booking) {
      return error(res, 'Booking not found', 404);
    }
    return success(res, { booking }, 200, 'Booking fetched successfully');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = {
  checkAvailability,
  createBooking,
  updateBooking,
  cancelBooking,
  getBookingById
};
