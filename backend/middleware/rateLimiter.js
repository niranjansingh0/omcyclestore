import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: JSON.stringify({
    success: false,
    message: 'Too many requests, please try again later'
  }),
  headers: true
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: JSON.stringify({
    success: false,
    message: 'Too many authentication attempts, please try again later'
  }),
  headers: true
});
