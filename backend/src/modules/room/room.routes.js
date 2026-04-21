const express = require('express');
const {
  addRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
} = require('./room.controller');
const {
  addRoomValidator,
  updateRoomValidator,
  filterRoomsValidator,
} = require('./room.validator');
const { authenticate } = require('../../middleware/authenticate');
const { authorize } = require('../../middleware/authorize');

const router = express.Router();

// Public routes
router.get('/', filterRoomsValidator, getAllRooms);
router.get('/:id', getRoomById);

// Protected routes (Admin and Staff only)
router.use(authenticate);
router.use(authorize('ADMIN', 'STAFF'));

router.post('/', addRoomValidator, addRoom);
router.patch('/:id', updateRoomValidator, updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;
