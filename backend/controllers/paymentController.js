import Razorpay from 'razorpay';
import crypto from 'crypto';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid amount'
    });
  }

  const options = {
    amount: Math.round(amount * 100), // Convert to paise
    currency,
    receipt: `order_${Date.now()}`,
    payment_capture: 1
  };

  const order = await razorpay.orders.create(options);

  sendSuccess(res, 200, 'Razorpay order created', {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: 'Payment verification failed'
    });
  }

  sendSuccess(res, 200, 'Payment verified successfully', {
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id
  });
});