const { body } = require('express-validator');

const updateProfileValidator = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s-]{10,15}$/)
    .withMessage('Please provide a valid phone number'),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address cannot exceed 255 characters'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),

  body('profilePic')
    .optional()
    .trim()
    .isURL()
    .withMessage('Profile picture must be a valid URL'),
];

module.exports = { updateProfileValidator };
