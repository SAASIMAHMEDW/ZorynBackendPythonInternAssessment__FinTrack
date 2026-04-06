import { Router } from 'express';
import {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
} from '../controllers/record.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';
import {
  createRecordSchema,
  updateRecordSchema,
  queryRecordSchema,
} from '../validators/record';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Viewer+ can read records
router.get('/', validate(queryRecordSchema, 'query'), getRecords);
router.get('/:id', getRecordById);

// Admin only can create / update / delete
router.post(
  '/',
  requireRole('ADMIN'),
  validate(createRecordSchema),
  createRecord
);
router.patch(
  '/:id',
  requireRole('ADMIN'),
  validate(updateRecordSchema),
  updateRecord
);
router.delete('/:id', requireRole('ADMIN'), deleteRecord);

export default router;
