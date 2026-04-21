const { validationResult } = require('express-validator');
const roomService = require('./room.service');
const { success, error } = require('../../utils/response.util');

const addRoom = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 422);
  }

  try {
    const room = await roomService.addRoom(req.body);
    return success(res, { room }, 201, 'Room added successfully');
  } catch (err) {
    if (err.code === 'P2002') {
      return error(res, 'Room number already exists', 400);
    }
    return error(res, err.message, 500);
  }
};

const updateRoom = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 422);
  }

  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    return success(res, { room }, 200, 'Room updated successfully');
  } catch (err) {
    if (err.code === 'P2025') {
      return error(res, 'Room not found', 404);
    }
    return error(res, err.message, 500);
  }
};

const deleteRoom = async (req, res) => {
  try {
    await roomService.deleteRoom(req.params.id);
    return success(res, null, 200, 'Room deleted successfully');
  } catch (err) {
    if (err.code === 'P2025') {
      return error(res, 'Room not found', 404);
    }
    return error(res, err.message, 500);
  }
};

const getAllRooms = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return error(res, errors.array()[0].msg, 422);
  }

  try {
    const rooms = await roomService.getAllRooms(req.query);
    return success(res, { rooms }, 200, 'Rooms fetched successfully');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getRoomById = async (req, res) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    if (!room) {
      return error(res, 'Room not found', 404);
    }
    return success(res, { room }, 200, 'Room fetched successfully');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = {
  addRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
};
