import { Router } from 'express';
import {
  checkoutSummary,
  getMyOrders,
  getOrderById,
  placeOrder,
  trackOrder,
  verifyPayment
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  checkoutValidator,
  placeOrderValidator,
  verifyPaymentValidator
} from '../validators/orderValidator.js';

const router = Router();

router.use(protect);
router.post('/checkout/summary', checkoutValidator, validate, checkoutSummary);
router.post('/', placeOrderValidator, validate, placeOrder);
router.get('/', getMyOrders);
router.get('/track/:orderNumber', trackOrder);
router.get('/:id', getOrderById);
router.post('/:id/verify-payment', verifyPaymentValidator, validate, verifyPayment);

export default router;
