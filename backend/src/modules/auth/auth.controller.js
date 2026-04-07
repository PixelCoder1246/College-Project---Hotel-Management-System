const { validationResult } = require('express-validator');
const authService = require('./auth.service');
const { success, error } = require('../../utils/response.util');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 422);
  }

  try {
    const user = await authService.register(req.body);
    return success(
      res,
      { user },
      201,
      'Account created successfully. Please log in.'
    );
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 422);
  }

  try {
    const result = await authService.login(req.body);
    const message = result.requiresOtp
      ? 'OTP sent to your email. Please verify.'
      : 'Login successful.';
    return success(res, result, 200, message);
  } catch (err) {
    return error(res, err.message, 401);
  }
};

const verifyOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 422);
  }

  try {
    const result = await authService.verifyOtp(req.body);
    return success(res, result, 200, 'Login successful. Welcome back!');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    return success(res, { user }, 200, 'User fetched successfully.');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = { register, login, verifyOtp, getMe };
