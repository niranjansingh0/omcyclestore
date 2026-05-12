import { Router } from 'express';
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  addToCartValidator,
  cartItemParamValidator,
  updateCartValidator
} from '../validators/cartValidator.js';

const router = Router();

router.use(protect);
router.get('/', getCart);
router.post('/', addToCartValidator, validate, addToCart);
router.patch('/:itemId', updateCartValidator, validate, updateCartItem);
router.delete('/:itemId', cartItemParamValidator, validate, removeCartItem);
router.delete('/', clearCart);

export default router;
