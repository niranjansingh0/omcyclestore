import { body, param } from 'express-validator';

export const addToCartValidator = [
  body('product').isMongoId().withMessage('Valid product id is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

export const updateCartValidator = [
  param('itemId').isMongoId().withMessage('Valid cart item id is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

export const cartItemParamValidator = [
  param('itemId').isMongoId().withMessage('Valid cart item id is required')
];
