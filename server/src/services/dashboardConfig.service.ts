import { prisma } from '../lib/prisma';

const DEFAULT_CONFIG = {
  layout: [
    { i: 'summary-income', x: 0, y: 0, w: 3, h: 2 },
    { i: 'summary-expense', x: 3, y: 0, w: 3, h: 2 },
    { i: 'summary-balance', x: 6, y: 0, w: 3, h: 2 },
    { i: 'summary-records', x: 9, y: 0, w: 3, h: 2 },
    { i: 'trends', x: 0, y: 2, w: 6, h: 4 },
    { i: 'categories', x: 6, y: 2, w: 6, h: 4 },
    { i: 'recent', x: 0, y: 6, w: 12, h: 4 },
  ],
  charts: [
    { id: 'trends', type: 'AREA', title: 'Financial Trends', showLegend: true },
    { id: 'categories', type: 'PIE', title: 'Expense Breakdown', showLegend: true },
  ],
};

export class DashboardConfigService {
  static async getConfig(userId: string, configId?: string) {
    const config = configId && configId !== 'default'
      ? await prisma.dashboardConfig.findFirst({
          where: { id: configId, userId },
        })
      : await prisma.dashboardConfig.findFirst({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
        });

    if (!config) {
      return {
        ...DEFAULT_CONFIG,
        userId,
        id: 'default',
        name: 'Default Dashboard',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return config;
  }

  static async listConfigs(userId: string) {
    return prisma.dashboardConfig.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  static async deleteConfig(userId: string, configId: string) {
    return prisma.dashboardConfig.delete({
      where: { id: configId, userId },
    });
  }

  static async upsertConfig(userId: string, data: { id?: string; name?: string; layout: any; charts: any }) {
    // If id is provided and not 'default', try to update or create
    if (data.id && data.id !== 'default') {
      const existing = await prisma.dashboardConfig.findFirst({
        where: { id: data.id, userId },
      });

      if (existing) {
        return prisma.dashboardConfig.update({
          where: { id: data.id },
          data: {
            name: data.name,
            layout: data.layout,
            charts: data.charts,
          },
        });
      }
    }

    // Create new dashboard
    return prisma.dashboardConfig.create({
      data: {
        userId,
        name: data.name || 'New Dashboard',
        layout: data.layout,
        charts: data.charts,
      },
    });
  }
}
