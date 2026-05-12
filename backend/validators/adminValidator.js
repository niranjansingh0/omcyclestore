import { body, param } from 'express-validator';

export const orderStatusUpdateValidator = [
  param('id').isMongoId().withMessage('Valid order id is required'),
  body('orderStatus')
    .optional()
    .isIn(['placed', 'confirmed', 'packed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'paid', 'failed', 'refunded'])
    .withMessage('Invalid payment status')
];

export const mongoIdParamValidator = [
  param('id').isMongoId().withMessage('Valid resource id is required')
];
