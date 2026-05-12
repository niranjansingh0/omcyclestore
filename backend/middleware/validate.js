import { validationResult } from 'express-validator';
import AppError from '../utils/appError.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return next(
    new AppError(
      'Validation failed',
      400,
      errors.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    )
  );
};

export default validate;
