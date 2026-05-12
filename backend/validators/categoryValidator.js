import { body, param } from 'express-validator';

export const categoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('type')
    .optional()
    .isIn(['product', 'service', 'recharge', 'general'])
    .withMessage('Invalid category type')
];

export const categoryUpdateValidator = [
  body('name').optional().trim().notEmpty().withMessage('Category name cannot be empty'),
  body('type')
    .optional()
    .isIn(['product', 'service', 'recharge', 'general'])
    .withMessage('Invalid category type')
];

export const categoryParamValidator = [
  param('id').isMongoId().withMessage('Valid category id is required')
];
