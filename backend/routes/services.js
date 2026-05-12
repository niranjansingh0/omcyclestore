import { Router } from 'express';
import {
  bookMobileRepair,
  bookRechargeService,
  createRechargePlan,
  deleteRechargePlan,
  getMyServiceBookings,
  getRechargePlans,
  trackServiceBooking,
  updateRechargePlan,
  updateServiceBookingStatus
} from '../controllers/serviceController.js';
import { authorize, protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  bookingNumberParamValidator,
  rechargeBookingValidator,
  rechargePlanValidator,
  repairBookingValidator,
  serviceStatusValidator
} from '../validators/serviceValidator.js';
import { mongoIdParamValidator } from '../validators/adminValidator.js';

const router = Router();

router.get('/recharge-plans', getRechargePlans);
router.post(
  '/recharge-plans',
  protect,
  authorize('admin', 'manager'),
  rechargePlanValidator,
  validate,
  createRechargePlan
);
router.patch(
  '/recharge-plans/:id',
  protect,
  authorize('admin', 'manager'),
  mongoIdParamValidator,
  rechargePlanValidator,
  validate,
  updateRechargePlan
);
router.delete(
  '/recharge-plans/:id',
  protect,
  authorize('admin', 'manager'),
  mongoIdParamValidator,
  validate,
  deleteRechargePlan
);

router.use(protect);
router.get('/history', getMyServiceBookings);
router.get('/track/:bookingNumber', bookingNumberParamValidator, validate, trackServiceBooking);
router.post('/repair-bookings', repairBookingValidator, validate, bookMobileRepair);
router.post('/recharge-bookings', rechargeBookingValidator, validate, bookRechargeService);
router.patch(
  '/bookings/:id/status',
  authorize('admin', 'manager'),
  serviceStatusValidator,
  validate,
  updateServiceBookingStatus
);

export default router;
