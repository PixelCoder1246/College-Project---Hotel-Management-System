const prisma = require('../../config/db');

/**
 * Add a new room
 */
const addRoom = async (roomData) => {
  return await prisma.room.create({
    data: roomData,
  });
};

/**
 * Update an existing room
 */
const updateRoom = async (roomId, roomData) => {
  return await prisma.room.update({
    where: { id: roomId },
    data: roomData,
  });
};

/**
 * Delete a room
 */
const deleteRoom = async (roomId) => {
  return await prisma.room.delete({
    where: { id: roomId },
  });
};

/**
 * Get all rooms with optional filtering
 */
const getAllRooms = async (filters = {}) => {
  const { type, status, minPrice, maxPrice, capacity } = filters;

  const where = {};

  if (type) where.type = type;
  if (status) where.status = status;
  if (capacity) where.capacity = { gte: parseInt(capacity) };

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  return await prisma.room.findMany({
    where,
    orderBy: { roomNumber: 'asc' },
  });
};

/**
 * Get room by ID
 */
const getRoomById = async (roomId) => {
  return await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      bookings: true,
    },
  });
};

module.exports = {
  addRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
};
