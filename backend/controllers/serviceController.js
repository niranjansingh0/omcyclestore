import RechargePlan from '../models/RechargePlan.js';
import ServiceBooking from '../models/ServiceBooking.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { sendSuccess } from '../utils/response.js';
import { generateReference } from '../utils/helpers.js';

export const getRechargePlans = asyncHandler(async (req, res) => {
  const query = { isActive: true };
  if (req.query.operator) query.operator = req.query.operator;
  if (req.query.circle) query.circle = req.query.circle;

  const plans = await RechargePlan.find(query).sort({ amount: 1 });
  sendSuccess(res, 200, 'Recharge plans fetched successfully', { plans });
});

export const createRechargePlan = asyncHandler(async (req, res) => {
  const plan = await RechargePlan.create(req.body);
  sendSuccess(res, 201, 'Recharge plan created successfully', { plan });
});

export const updateRechargePlan = asyncHandler(async (req, res) => {
  const plan = await RechargePlan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!plan) {
    throw new AppError('Recharge plan not found', 404);
  }

  sendSuccess(res, 200, 'Recharge plan updated successfully', { plan });
});

export const deleteRechargePlan = asyncHandler(async (req, res) => {
  const plan = await RechargePlan.findByIdAndDelete(req.params.id);
  if (!plan) {
    throw new AppError('Recharge plan not found', 404);
  }

  sendSuccess(res, 200, 'Recharge plan deleted successfully');
});

export const bookMobileRepair = asyncHandler(async (req, res) => {
  const booking = await ServiceBooking.create({
    ...req.body,
    bookingNumber: generateReference('SRV'),
    user: req.user._id,
    serviceType: 'mobile-repair',
    timeline: [
      {
        status: 'requested',
        note: 'Repair booking created'
      }
    ]
  });

  sendSuccess(res, 201, 'Mobile repair booking created', { booking });
});

export const bookRechargeService = asyncHandler(async (req, res) => {
  const plan = await RechargePlan.findById(req.body.rechargePlan);
  if (!plan || !plan.isActive) {
    throw new AppError('Recharge plan not found', 404);
  }

  const booking = await ServiceBooking.create({
    ...req.body,
    bookingNumber: generateReference('RCH'),
    user: req.user._id,
    serviceType: 'mobile-recharge',
    estimatedAmount: plan.amount,
    finalAmount: plan.amount,
    timeline: [
      {
        status: 'requested',
        note: 'Recharge request created'
      }
    ]
  });

  sendSuccess(res, 201, 'Recharge service booking created', { booking });
});

export const getMyServiceBookings = asyncHandler(async (req, res) => {
  const bookings = await ServiceBooking.find({ user: req.user._id })
    .populate('rechargePlan')
    .sort('-createdAt');

  sendSuccess(res, 200, 'Service history fetched successfully', { bookings });
});

export const trackServiceBooking = asyncHandler(async (req, res) => {
  const booking = await ServiceBooking.findOne({
    bookingNumber: req.params.bookingNumber,
    user: req.user._id
  }).populate('rechargePlan');

  if (!booking) {
    throw new AppError('Service booking not found', 404);
  }

  sendSuccess(res, 200, 'Service booking fetched successfully', { booking });
});

export const updateServiceBookingStatus = asyncHandler(async (req, res) => {
  const booking = await ServiceBooking.findById(req.params.id);
  if (!booking) {
    throw new AppError('Service booking not found', 404);
  }

  booking.status = req.body.status;
  booking.finalAmount = req.body.finalAmount ?? booking.finalAmount;
  booking.paymentStatus = req.body.paymentStatus ?? booking.paymentStatus;
  booking.timeline.push({
    status: req.body.status,
    note: req.body.note || 'Status updated by admin'
  });

  await booking.save();
  sendSuccess(res, 200, 'Service booking updated successfully', { booking });
});
