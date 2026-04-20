const prisma = require('../../config/db');

/**
 * Get user profile by ID
 */
const getProfile = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      bio: true,
      profilePic: true,
      createdAt: true,
    },
  });
};

/**
 * Update user profile
 */
const updateProfile = async (userId, data) => {
  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      bio: true,
      profilePic: true,
    },
  });
};

/**
 * Get booking history for a user
 */
const getBookingHistory = async (userId) => {
  return await prisma.booking.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

module.exports = {
  getProfile,
  updateProfile,
  getBookingHistory,
};
