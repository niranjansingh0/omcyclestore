import { body, param } from 'express-validator';

export const repairBookingValidator = [
  body('contactPhone').trim().notEmpty().withMessage('Contact phone is required'),
  body('issueDescription').trim().notEmpty().withMessage('Issue description is required')
];

export const rechargeBookingValidator = [
  body('contactPhone').trim().notEmpty().withMessage('Contact phone is required'),
  body('rechargePlan').isMongoId().withMessage('Valid recharge plan is required')
];

export const rechargePlanValidator = [
  body('operator').trim().notEmpty().withMessage('Operator is required'),
  body('circle').trim().notEmpty().withMessage('Circle is required'),
  body('planName').trim().notEmpty().withMessage('Plan name is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Valid amount is required'),
  body('validity').trim().notEmpty().withMessage('Validity is required')
];

export const bookingNumberParamValidator = [
  param('bookingNumber').notEmpty().withMessage('Booking number is required')
];

export const serviceStatusValidator = [
  param('id').isMongoId().withMessage('Valid service booking id is required'),
  body('status')
    .isIn(['requested', 'accepted', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Invalid service status')
];
