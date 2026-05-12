import { Router } from 'express';
import {
  createReview,
  deleteReview,
  getProductReviews
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { reviewCreateValidator, reviewParamValidator } from '../validators/reviewValidator.js';

const router = Router({ mergeParams: true });

router.get('/', getProductReviews);
router.post('/', protect, reviewCreateValidator, validate, createReview);
router.delete('/:id', protect, reviewParamValidator, validate, deleteReview);

export default router;
