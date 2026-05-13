import { Router } from 'express';
import authRoutes from './auth.js';
import productRoutes from './products.js';
import categoryRoutes from './categories.js';
import cartRoutes from './cart.js';
import orderRoutes from './orders.js';
import serviceRoutes from './services.js';
import userRoutes from './users.js';
import adminRoutes from './admin.js';
import paymentRoutes from './payments.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/services', serviceRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);

export default router;
