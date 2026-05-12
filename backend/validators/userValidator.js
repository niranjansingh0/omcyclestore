import { body, param } from 'express-validator';

export const updateProfileValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().isString()
];

export const adminUserUpdateValidator = [
  param('id').isMongoId().withMessage('Valid user id is required'),
  body('role')
    .optional()
    .isIn(['customer', 'admin', 'manager'])
    .withMessage('Invalid role'),
  body('status')
    .optional()
    .isIn(['active', 'suspended'])
    .withMessage('Invalid status')
];
