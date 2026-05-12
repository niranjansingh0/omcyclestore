import { Router } from 'express';
import { listUsers, updateProfile, updateUserStatus } from '../controllers/userController.js';
import { authorize, protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { uploadAvatar } from '../middleware/upload.js';
import { adminUserUpdateValidator, updateProfileValidator } from '../validators/userValidator.js';

const router = Router();

router.use(protect);
router.patch('/me', uploadAvatar, updateProfileValidator, validate, updateProfile);
router.get('/', authorize('admin', 'manager'), listUsers);
router.patch('/:id', authorize('admin', 'manager'), adminUserUpdateValidator, validate, updateUserStatus);

export default router;
