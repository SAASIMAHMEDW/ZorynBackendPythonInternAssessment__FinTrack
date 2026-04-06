import { Router } from 'express';
import {
  getSummary,
  getCategoryBreakdown,
  getTrends,
  getRecentActivity,
} from '../controllers/dashboard.controller';
import {
  getConfig,
  updateConfig,
  listConfigs,
  deleteConfig
} from '../controllers/dashboardConfig.controller';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// Recent activity is available to all roles (Viewer+)
router.get('/recent', getRecentActivity);

// Analytics endpoints require Viewer, Analyst or Admin role
router.get('/summary', requireRole('VIEWER', 'ANALYST', 'ADMIN'), getSummary);
router.get(
  '/category-breakdown',
  requireRole('VIEWER', 'ANALYST', 'ADMIN'),
  getCategoryBreakdown
);
router.get('/trends', requireRole('VIEWER', 'ANALYST', 'ADMIN'), getTrends);

// Dashboard configuration routes
router.get('/config', getConfig);
router.get('/config/list', listConfigs);
router.post('/config', requireRole('ANALYST', 'ADMIN'), updateConfig);
router.delete('/config/:id', requireRole('ANALYST', 'ADMIN'), deleteConfig);

export default router;
