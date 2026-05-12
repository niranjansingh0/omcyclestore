import mongoose from 'mongoose';
import AppError from '../utils/appError.js';

export const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

export const errorHandler = (error, req, res, next) => {
  let err = error;

  if (err instanceof mongoose.Error.CastError) {
    err = new AppError('Invalid resource identifier', 400);
  }

  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    err = new AppError(`Duplicate value for ${fields.join(', ')}`, 409);
  }

  if (err.name === 'ValidationError') {
    err = new AppError(
      'Validation failed',
      400,
      Object.values(err.errors).map((item) => item.message)
    );
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(err.details ? { details: err.details } : {}),
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
};
