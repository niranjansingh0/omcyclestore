import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { sendSuccess } from '../utils/response.js';
import { generateReference } from '../utils/helpers.js';
import { createRazorpayOrder, verifyRazorpaySignature } from '../services/paymentService.js';
import { validateAndPrepareOrderItems } from '../services/orderService.js';

const normalizeAddress = (address) => ({
  fullName: address.fullName,
  phone: address.phone,
  line1: address.line1,
  line2: address.line2,
  city: address.city,
  state: address.state,
  postalCode: address.postalCode,
  country: address.country || 'India'
});

const getCartItemsForOrder = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || !cart.items.length) {
    throw new AppError('Cart is empty', 400);
  }

  return cart.items.map((item) => ({
    product: item.product._id,
    quantity: item.quantity
  }));
};

export const checkoutSummary = asyncHandler(async (req, res) => {
  const items = req.body.items?.length ? req.body.items : await getCartItemsForOrder(req.user._id);
  const { preparedItems, totalAmount } = await validateAndPrepareOrderItems(items);

  sendSuccess(res, 200, 'Checkout summary generated', {
    items: preparedItems,
    pricing: {
      subtotal: totalAmount,
      shippingFee: totalAmount > 999 ? 0 : 49,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: totalAmount > 999 ? totalAmount : totalAmount + 49
    }
  });
});

export const placeOrder = asyncHandler(async (req, res) => {
  const items = req.body.items?.length ? req.body.items : await getCartItemsForOrder(req.user._id);
  const { preparedItems, totalAmount } = await validateAndPrepareOrderItems(items);

  const shippingFee = totalAmount > 999 ? 0 : 49;
  const totalOrderAmount = totalAmount + shippingFee;
  const orderNumber = generateReference('ORD');

  const order = await Order.create({
    orderNumber,
    user: req.user._id,
    items: preparedItems,
    shippingAddress: normalizeAddress(req.body.shippingAddress),
    paymentMethod: req.body.paymentMethod,
    paymentStatus: 'pending',
    orderStatus: 'placed',
    subtotal: totalAmount,
    shippingFee,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: totalOrderAmount,
    notes: req.body.notes
  });

  for (const item of preparedItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: -item.quantity,
        soldCount: item.quantity
      }
    });
  }

  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  let razorpayOrder = null;
  if (req.body.paymentMethod === 'razorpay') {
    razorpayOrder = await createRazorpayOrder({
      amount: totalOrderAmount,
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();
  }

  sendSuccess(res, 201, 'Order placed successfully', {
    order,
    razorpayOrder
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const query =
    req.user.role === 'admin' || req.user.role === 'manager'
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user._id };

  const order = await Order.findOne(query);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const isValid = verifyRazorpaySignature({
    orderId: req.body.razorpayOrderId,
    paymentId: req.body.razorpayPaymentId,
    signature: req.body.razorpaySignature
  });

  if (!isValid) {
    order.paymentStatus = 'failed';
    await order.save();
    throw new AppError('Payment signature verification failed', 400);
  }

  order.paymentStatus = 'paid';
  order.paidAt = new Date();
  order.razorpayOrderId = req.body.razorpayOrderId;
  order.razorpayPaymentId = req.body.razorpayPaymentId;
  order.razorpaySignature = req.body.razorpaySignature;
  await order.save();

  sendSuccess(res, 200, 'Payment verified successfully', { order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .populate('items.product', 'name slug images');

  sendSuccess(res, 200, 'Orders fetched successfully', { orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  }).populate('items.product', 'name slug images');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  sendSuccess(res, 200, 'Order fetched successfully', { order });
});

export const trackOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    orderNumber: req.params.orderNumber,
    user: req.user._id
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  sendSuccess(res, 200, 'Order tracking fetched successfully', {
    order: {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      deliveredAt: order.deliveredAt
    }
  });
});
