import { body, param } from 'express-validator';

export const reviewCreateValidator = [
  param('productId').isMongoId().withMessage('Valid product id is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString()
];

export const reviewParamValidator = [
  param('id').isMongoId().withMessage('Valid review id is required')
];
