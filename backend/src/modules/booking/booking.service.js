const prisma = require('../../config/db');

const checkAvailability = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  const conflicts = await prisma.booking.findFirst({
    where: {
      roomId,
      id: excludeBookingId ? { not: excludeBookingId } : undefined,
      status: { in: ['CONFIRMED', 'PENDING'] },
      OR: [
        {
          AND: [
            { checkIn: { lte: start } },
            { checkOut: { gt: start } }
          ]
        },
        {
          AND: [
            { checkIn: { lt: end } },
            { checkOut: { gte: end } }
          ]
        },
        {
          AND: [
            { checkIn: { gte: start } },
            { checkOut: { lte: end } }
          ]
        }
      ]
    }
  });

  return !conflicts;
};

const createBooking = async (bookingData) => {
  const { userId, roomId, checkIn, checkOut } = bookingData;

  const isAvailable = await checkAvailability(roomId, checkIn, checkOut);
  if (!isAvailable) {
    throw new Error('Room is not available for the selected dates');
  }

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    throw new Error('Room not found');
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const totalPrice = room.price * nights;

  return await prisma.booking.create({
    data: {
      userId,
      roomId,
      checkIn: start,
      checkOut: end,
      totalPrice,
      status: 'PENDING'
    }
  });
};

const updateBooking = async (bookingId, updateData) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    throw new Error('Booking not found');
  }

  const checkIn = updateData.checkIn || booking.checkIn;
  const checkOut = updateData.checkOut || booking.checkOut;
  const roomId = updateData.roomId || booking.roomId;

  if (updateData.checkIn || updateData.checkOut || updateData.roomId) {
    const isAvailable = await checkAvailability(roomId, checkIn, checkOut, bookingId);
    if (!isAvailable) {
      throw new Error('Room is not available for the selected dates');
    }
  }

  const data = { ...updateData };
  if (updateData.checkIn) data.checkIn = new Date(updateData.checkIn);
  if (updateData.checkOut) data.checkOut = new Date(updateData.checkOut);

  if (updateData.checkIn || updateData.checkOut || updateData.roomId) {
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    data.totalPrice = room.price * nights;
  }

  return await prisma.booking.update({
    where: { id: bookingId },
    data
  });
};

const cancelBooking = async (bookingId) => {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' }
  });
};

const getBookingById = async (bookingId) => {
  return await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      room: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

module.exports = {
  checkAvailability,
  createBooking,
  updateBooking,
  cancelBooking,
  getBookingById
};
