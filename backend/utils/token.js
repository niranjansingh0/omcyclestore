import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const signToken = (payload) =>
  jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expire
  });

export const createTokenCookieOptions = () => ({
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  maxAge: config.jwt.cookieExpireDays * 24 * 60 * 60 * 1000
});
