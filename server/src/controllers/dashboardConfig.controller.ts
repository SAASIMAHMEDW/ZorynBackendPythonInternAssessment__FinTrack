import { Response } from 'express';
import { DashboardConfigService } from '../services/dashboardConfig.service';
import { AuthenticatedRequest } from '../types';

export const getConfig = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.query;
    const configId = typeof id === 'string' ? id : undefined;
    const config = await DashboardConfigService.getConfig(req.user!.userId, configId);
    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard configuration',
    });
  }
};

export const listConfigs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const configs = await DashboardConfigService.listConfigs(req.user!.userId);
    res.json({
      success: true,
      data: configs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to list dashboard configurations',
    });
  }
};

export const updateConfig = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id, name, layout, charts } = req.body;
    const config = await DashboardConfigService.upsertConfig(req.user!.userId, { id, name, layout, charts });
    res.json({
      success: true,
      data: config,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update dashboard configuration',
    });
  }
};

export const deleteConfig = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await DashboardConfigService.deleteConfig(req.user!.userId, id as string);
    res.json({
      success: true,
      message: 'Design deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete dashboard configuration',
    });
  }
};
