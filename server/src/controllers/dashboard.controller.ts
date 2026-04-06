import { Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../types';

type DateRange = '7d' | '30d' | '90d' | 'ytd';

/**
 * GET /api/dashboard/summary
 */
export const getSummary = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const range = req.query.range as DateRange | undefined;
    const summary = await DashboardService.getSummary(range);
    sendSuccess(res, summary, 'Dashboard summary retrieved');
  }
);

/**
 * GET /api/dashboard/category-breakdown
 */
export const getCategoryBreakdown = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const range = req.query.range as DateRange | undefined;
    const breakdown = await DashboardService.getCategoryBreakdown(range);
    sendSuccess(res, breakdown, 'Category breakdown retrieved');
  }
);

/**
 * GET /api/dashboard/trends
 */
export const getTrends = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const range = req.query.range as DateRange | undefined;
    const trends = await DashboardService.getTrends(range);
    sendSuccess(res, trends, 'Trends retrieved');
  }
);

/**
 * GET /api/dashboard/recent
 */
export const getRecentActivity = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const range = req.query.range as DateRange | undefined;
    const recent = await DashboardService.getRecentActivity(10, range);
    sendSuccess(res, recent, 'Recent activity retrieved');
  }
);
