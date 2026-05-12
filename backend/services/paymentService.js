import crypto from 'crypto';
import razorpay from '../config/razorpay.js';
import config from '../config/index.js';
import AppError from '../utils/appError.js';

export const createRazorpayOrder = async ({ amount, receipt, notes = {} }) => {
  if (!razorpay) {
    throw new AppError('Razorpay is not configured', 500);
  }

  return razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: config.app.defaultCurrency,
    receipt,
    notes
  });
};

export const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
};
