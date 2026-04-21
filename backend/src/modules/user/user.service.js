const prisma = require('../../config/db');

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
