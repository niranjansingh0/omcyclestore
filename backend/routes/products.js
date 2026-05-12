import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  updateProductStock
} from '../controllers/productController.js';
import { authorize, optionalAuth, protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { uploadProductImages } from '../middleware/upload.js';
import {
  createProductValidator,
  stockUpdateValidator,
  updateProductValidator
} from '../validators/productValidator.js';
import reviewRouter from './reviews.js';

const router = Router();

router.use('/:productId/reviews', reviewRouter);

router.get('/', optionalAuth, getProducts);
router.get('/:id', optionalAuth, getProductById);
router.post(
  '/',
  protect,
  authorize('admin', 'manager'),
  uploadProductImages,
  createProductValidator,
  validate,
  createProduct
);
router.patch(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  uploadProductImages,
  updateProductValidator,
  validate,
  updateProduct
);
router.patch(
  '/:id/stock',
  protect,
  authorize('admin', 'manager'),
  stockUpdateValidator,
  validate,
  updateProductStock
);
router.delete('/:id', protect, authorize('admin', 'manager'), deleteProduct);

export default router;
