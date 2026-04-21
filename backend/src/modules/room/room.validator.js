const { body, query } = require('express-validator');

const addRoomValidator = [
  body('roomNumber')
    .notEmpty()
    .withMessage('Room number is required')
    .isString()
    .trim(),
  
  body('type')
    .notEmpty()
    .withMessage('Room type is required')
    .isIn(['SINGLE', 'DOUBLE', 'DELUXE', 'SUITE'])
    .withMessage('Invalid room type'),
  
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('status')
    .optional()
    .isIn(['AVAILABLE', 'BOOKED', 'MAINTENANCE'])
    .withMessage('Invalid room status'),
  
  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),
];

const updateRoomValidator = [
  body('roomNumber')
    .optional()
    .isString()
    .trim(),
  
  body('type')
    .optional()
    .isIn(['SINGLE', 'DOUBLE', 'DELUXE', 'SUITE'])
    .withMessage('Invalid room type'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('status')
    .optional()
    .isIn(['AVAILABLE', 'BOOKED', 'MAINTENANCE'])
    .withMessage('Invalid room status'),
  
  body('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),
];

const filterRoomsValidator = [
  query('type')
    .optional()
    .isIn(['SINGLE', 'DOUBLE', 'DELUXE', 'SUITE'])
    .withMessage('Invalid room type filter'),
  
  query('status')
    .optional()
    .isIn(['AVAILABLE', 'BOOKED', 'MAINTENANCE'])
    .withMessage('Invalid room status filter'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
  
  query('capacity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),
];

module.exports = {
  addRoomValidator,
  updateRoomValidator,
  filterRoomsValidator,
};
