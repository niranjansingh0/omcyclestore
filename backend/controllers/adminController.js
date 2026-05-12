import Order from '../models/Order.js';
import Product from '../models/Product.js';
import ServiceBooking from '../models/ServiceBooking.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { sendSuccess } from '../utils/response.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, totalBookings] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    ServiceBooking.countDocuments()
  ]);

  const sales = await Order.aggregate([
    { $match: { paymentStatus: { $in: ['paid', 'pending'] } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        paidRevenue: {
          $sum: {
            $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0]
          }
        }
      }
    }
  ]);

  const lowStockProducts = await Product.find({
    isActive: true,
    $expr: { $lte: ['$stock', '$lowStockThreshold'] }
  })
    .select('name sku stock lowStockThreshold')
    .limit(10);

  const recentOrders = await Order.find()
    .sort('-createdAt')
    .limit(5)
    .populate('user', 'name email');

  sendSuccess(res, 200, 'Admin dashboard fetched successfully', {
    stats: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalBookings,
      totalRevenue: sales[0]?.totalRevenue || 0,
      paidRevenue: sales[0]?.paidRevenue || 0
    },
    lowStockProducts,
    recentOrders
  });
});

export const listOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .sort('-createdAt')
    .populate('user', 'name email phone');

  sendSuccess(res, 200, 'Orders fetched successfully', { orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  order.orderStatus = req.body.orderStatus ?? order.orderStatus;
  order.paymentStatus = req.body.paymentStatus ?? order.paymentStatus;
  if (req.body.orderStatus === 'delivered') {
    order.deliveredAt = new Date();
  }

  await order.save();
  sendSuccess(res, 200, 'Order updated successfully', { order });
});

export const getInventoryReport = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .select('name sku stock lowStockThreshold soldCount price isActive updatedAt')
    .sort({ isActive: -1, updatedAt: -1 });

  sendSuccess(res, 200, 'Inventory report fetched successfully', { products });
});

export const getSalesReport = asyncHandler(async (req, res) => {
  const salesByDay = await Order.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        orders: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { _id: -1 } },
    { $limit: 30 }
  ]);

  sendSuccess(res, 200, 'Sales report fetched successfully', { salesByDay });
});
