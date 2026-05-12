import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory
} from '../controllers/categoryController.js';
import { authorize, protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  categoryParamValidator,
  categoryUpdateValidator,
  categoryValidator
} from '../validators/categoryValidator.js';

const router = Router();

router.get('/', getCategories);
router.post('/', protect, authorize('admin', 'manager'), categoryValidator, validate, createCategory);
router.patch(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  categoryParamValidator,
  categoryUpdateValidator,
  validate,
  updateCategory
);
router.delete(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  categoryParamValidator,
  validate,
  deleteCategory
);

export default router;
