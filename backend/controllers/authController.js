import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { sendSuccess } from '../utils/response.js';
import { signToken, createTokenCookieOptions } from '../utils/token.js';
import { generateRandomToken, hashToken } from '../utils/crypto.js';
import { sendEmail } from '../services/emailService.js';
import config from '../config/index.js';

const buildAuthResponse = (user) => {
  const token = signToken({ id: user._id, role: user.role });

  return {
    token,
    user: user.toJSON()
  };
};

const setAuthCookie = (res, token) => {
  res.cookie('token', token, createTokenCookieOptions());
};

export const register = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone
  });

  const { token, user: serializedUser } = buildAuthResponse(user);
  setAuthCookie(res, token);

  sendSuccess(res, 201, 'Registration successful', {
    token,
    user: serializedUser
  });
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Allow login if user has googleId (OAuth user) or has password
  if (user.googleId) {
    // Google user can login with any password (or no password validation)
  } else if (user.password && !(await user.comparePassword(req.body.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.status !== 'active') {
    throw new AppError('Account is not active', 403);
  }

  user.lastLoginAt = new Date();
  await user.save();

  const { token, user: serializedUser } = buildAuthResponse(user);
  setAuthCookie(res, token);

  sendSuccess(res, 200, 'Login successful', {
    token,
    user: serializedUser
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', createTokenCookieOptions());
  sendSuccess(res, 200, 'Logout successful');
});

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, 'Profile fetched successfully', {
    user: req.user.toJSON()
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select(
    '+passwordResetToken +passwordResetExpires'
  );

  if (!user) {
    throw new AppError('No user found with this email', 404);
  }

  const resetToken = generateRandomToken();
  const hashedToken = hashToken(resetToken);

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${config.frontendUrl}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Reset your Om Cycle Store password',
    text: `Reset your password using this link: ${resetUrl}`,
    html: `<p>Reset your password using this link:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
  });

  sendSuccess(res, 200, 'Password reset instructions sent');
});

export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = hashToken(req.params.token);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() }
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    throw new AppError('Reset token is invalid or expired', 400);
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const { token, user: serializedUser } = buildAuthResponse(user);
  setAuthCookie(res, token);

  sendSuccess(res, 200, 'Password reset successful', {
    token,
    user: serializedUser
  });
});

// Google OAuth callback
export const googleCallback = asyncHandler(async (req, res) => {
  const { token, user: serializedUser } = buildAuthResponse(req.user);
  setAuthCookie(res, token);

  // Redirect to frontend with token in URL
  res.redirect(`${config.frontendUrl}/login?token=${token}`);
});
