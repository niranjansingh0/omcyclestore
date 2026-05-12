import { body, param } from 'express-validator';

const addressRules = [
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Shipping full name is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Shipping phone is required'),
  body('shippingAddress.line1').trim().notEmpty().withMessage('Shipping line1 is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('Shipping city is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('Shipping state is required'),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('Shipping postal code is required')
];

export const checkoutValidator = [
  body('items').optional().isArray().withMessage('Items must be an array')
];

export const placeOrderValidator = [
  ...addressRules,
  body('items').optional().isArray().withMessage('Items must be an array'),
  body('paymentMethod')
    .isIn(['razorpay', 'cod'])
    .withMessage('Payment method must be razorpay or cod')
];

export const verifyPaymentValidator = [
  param('id').isMongoId().withMessage('Valid order id is required'),
  body('razorpayOrderId').notEmpty().withMessage('Razorpay order id is required'),
  body('razorpayPaymentId').notEmpty().withMessage('Razorpay payment id is required'),
  body('razorpaySignature').notEmpty().withMessage('Razorpay signature is required')
];
