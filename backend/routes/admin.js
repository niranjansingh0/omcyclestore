import { Router } from 'express';
import {
  getDashboard,
  getInventoryReport,
  getSalesReport,
  listOrders,
  updateOrderStatus
} from '../controllers/adminController.js';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from '../controllers/productController.js';
import { authorize, protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { uploadProductImages } from '../middleware/upload.js';
import { orderStatusUpdateValidator } from '../validators/adminValidator.js';
import { createProductValidator, updateProductValidator } from '../validators/productValidator.js';

const router = Router();

router.use(protect, authorize('admin', 'manager'));

router.get('/dashboard', getDashboard);
router.get('/orders', listOrders);
router.patch('/orders/:id', orderStatusUpdateValidator, validate, updateOrderStatus);
router.get('/inventory', getInventoryReport);
router.get('/sales-report', getSalesReport);

// Product CRUD
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', uploadProductImages, createProductValidator, validate, createProduct);
router.put('/products/:id', uploadProductImages, updateProductValidator, validate, updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
