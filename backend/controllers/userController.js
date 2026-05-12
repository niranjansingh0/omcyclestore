import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { sendSuccess } from '../utils/response.js';

export const updateProfile = asyncHandler(async (req, res) => {
  const updates = {};

  if (req.body.name) updates.name = req.body.name;
  if (req.body.phone) updates.phone = req.body.phone;

  // Handle avatar upload (base64)
  if (req.file) {
    const base64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    updates.avatar = {
      public_id: null,
      url: `data:${mimeType};base64,${base64}`
    };
  }

  if (req.body.avatarUrl) {
    updates.avatar = {
      public_id: null,
      url: req.body.avatarUrl
    };
  }

  if (req.body.addresses) {
    updates.addresses = req.body.addresses;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true
  });

  sendSuccess(res, 200, 'Profile updated successfully', { user });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  sendSuccess(res, 200, 'Users fetched successfully', { users });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role, status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  sendSuccess(res, 200, 'User updated successfully', { user });
});
