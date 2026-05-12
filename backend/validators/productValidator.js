import { body, param } from 'express-validator';

export const createProductValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isMongoId().withMessage('Valid category is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be zero or more')
];

export const updateProductValidator = [
  param('id').isMongoId().withMessage('Valid product id is required')
];

export const stockUpdateValidator = [
  param('id').isMongoId().withMessage('Valid product id is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be zero or more')
];
