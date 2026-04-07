const bcrypt = require('bcryptjs');
const prisma = require('../../config/db');
const { signToken, verifyToken } = require('../../utils/jwt.util');
const { generateOtp } = require('../../utils/otp.util');
const { sendOtpEmail } = require('../../services/email.service');

const SALT_ROUNDS = 12;

const register = async ({ name, email, password, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('An account with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'CUSTOMER',
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return user;
};

const login = async ({ email, password, trustedToken }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password.');
  }

  if (trustedToken && user.trustedTokens.includes(trustedToken)) {
    try {
      verifyToken(trustedToken);
      const token = signToken(
        { id: user.id, role: user.role },
        process.env.JWT_EXPIRES_IN || '7d'
      );
      return {
        requiresOtp: false,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
    } catch {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          trustedTokens: {
            set: user.trustedTokens.filter((t) => t !== trustedToken),
          },
        },
      });
    }
  }

  const { otp, expiry } = generateOtp();
  await prisma.user.update({
    where: { id: user.id },
    data: { otpCode: otp, otpExpiry: expiry },
  });

  await sendOtpEmail(user.email, otp, user.name);

  return { requiresOtp: true };
};

const verifyOtp = async ({ email, otp, rememberMe }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.otpCode || !user.otpExpiry) {
    throw new Error('OTP not found. Please initiate login again.');
  }

  if (new Date() > user.otpExpiry) {
    throw new Error(
      'OTP has expired. Please log in again to receive a new one.'
    );
  }

  if (user.otpCode !== otp) {
    throw new Error('Invalid OTP. Please check your email and try again.');
  }

  const updateData = { otpCode: null, otpExpiry: null };
  let trustedToken = null;

  if (rememberMe) {
    trustedToken = signToken(
      { id: user.id, type: 'trusted' },
      process.env.JWT_REMEMBER_EXPIRES_IN || '90d'
    );
    updateData.trustedTokens = { push: trustedToken };
  }

  await prisma.user.update({ where: { id: user.id }, data: updateData });

  const token = signToken(
    { id: user.id, role: user.role },
    process.env.JWT_EXPIRES_IN || '7d'
  );

  return {
    token,
    trustedToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return user;
};

module.exports = { register, login, verifyOtp, getMe };
