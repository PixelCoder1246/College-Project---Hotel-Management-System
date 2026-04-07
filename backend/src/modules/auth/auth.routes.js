const express = require('express');
const { register, login, verifyOtp, getMe } = require('./auth.controller');
const {
  registerValidator,
  loginValidator,
  otpValidator,
} = require('./auth.validator');
const { authenticate } = require('../../middleware/authenticate');

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/verify-otp', otpValidator, verifyOtp);

router.get('/me', authenticate, getMe);

module.exports = router;
