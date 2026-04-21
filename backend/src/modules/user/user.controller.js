const { validationResult } = require('express-validator');
const userService = require('./user.service');
const { success, error } = require('../../utils/response.util');

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    if (!user) {
      return error(res, 'User not found', 404);
    }
    return success(res, { user }, 200, 'Profile fetched successfully');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 422);
  }

  try {
    const updatedUser = await userService.updateProfile(req.user.id, req.body);
    return success(
      res,
      { user: updatedUser },
      200,
      'Profile updated successfully'
    );
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getBookingHistory = async (req, res) => {
  try {
    const bookings = await userService.getBookingHistory(req.user.id);
    return success(
      res,
      { bookings },
      200,
      'Booking history fetched successfully'
    );
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getBookingHistory,
};
