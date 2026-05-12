import crypto from 'crypto';

export const hashToken = (value) =>
  crypto.createHash('sha256').update(value).digest('hex');

export const generateRandomToken = () => crypto.randomBytes(32).toString('hex');

export const generateNumericCode = (length = 6) => {
  let code = '';
  for (let index = 0; index < length; index += 1) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
};
