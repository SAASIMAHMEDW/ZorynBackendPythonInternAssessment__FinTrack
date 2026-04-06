import { Router } from 'express';
import { getUsers, getUserById, updateUser, deactivateUser } from '../controllers/user.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import { updateUserSchema, queryUserSchema } from '../validators/user';

const router = Router();

// All user management routes require Admin role
router.use(authenticate, requireRole('ADMIN'));

router.get('/', validate(queryUserSchema, 'query'), getUsers);
router.get('/:id', getUserById);
router.patch('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', deactivateUser);

export default router;
