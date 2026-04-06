import { prisma } from '../lib/prisma';

type DateRange = '7d' | '30d' | '90d' | 'ytd';

function getDateRange(range?: DateRange): { gte: Date } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (range) {
    case '7d':
      return { gte: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000) };
    case '30d':
      return { gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) };
    case '90d':
      return { gte: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000) };
    case 'ytd':
      return { gte: new Date(today.getFullYear(), 0, 1) };
    default:
      // All time - return a very old date
      return { gte: new Date(0) };
  }
}

export class DashboardService {
  /**
   * Overall financial summary: total income, expenses, net balance, record count.
   */
  static async getSummary(range?: DateRange) {
    const dateFilter = { date: getDateRange(range) };
    
    const [incomeResult, expenseResult, recordCount] = await Promise.all([
      prisma.financialRecord.aggregate({
        where: { type: 'INCOME', isDeleted: false, ...dateFilter },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.financialRecord.aggregate({
        where: { type: 'EXPENSE', isDeleted: false, ...dateFilter },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.financialRecord.count({ where: { isDeleted: false, ...dateFilter } }),
    ]);

    const totalIncome = Number(incomeResult._sum.amount || 0);
    const totalExpenses = Number(expenseResult._sum.amount || 0);

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      totalRecords: recordCount,
      incomeCount: incomeResult._count,
      expenseCount: expenseResult._count,
    };
  }

  /**
   * Breakdown of income & expense by category.
   */
  static async getCategoryBreakdown(range?: DateRange) {
    const dateFilter = { date: getDateRange(range) };
    
    const results = await prisma.financialRecord.groupBy({
      by: ['category', 'type'],
      where: { isDeleted: false, ...dateFilter },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: 'desc' } },
    });

    return results.map((r) => ({
      category: r.category,
      type: r.type,
      total: Number(r._sum.amount || 0),
      count: r._count,
    }));
  }

  /**
   * Monthly income vs expense trends for the last 12 months.
   */
  static async getTrends(range?: DateRange) {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    twelveMonthsAgo.setDate(1);

    // If range is specified, use it instead of 12 months
    let startDate = twelveMonthsAgo;
    if (range === '7d') {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === '30d') {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === '90d') {
      startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    }

    const records = await prisma.financialRecord.findMany({
      where: {
        isDeleted: false,
        date: { gte: startDate },
      },
      select: { date: true, type: true, amount: true },
      orderBy: { date: 'asc' },
    });

    // Aggregate by month
    const monthlyMap = new Map<
      string,
      { month: string; income: number; expense: number }
    >();

    for (const record of records) {
      const d = new Date(record.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap.has(key)) {
        monthlyMap.set(key, { month: key, income: 0, expense: 0 });
      }

      const entry = monthlyMap.get(key)!;
      const amount = Number(record.amount);

      if (record.type === 'INCOME') {
        entry.income += amount;
      } else {
        entry.expense += amount;
      }
    }

    // Fill missing months
    const result: { month: string; income: number; expense: number }[] = [];
    const now = new Date();
    
    // Calculate number of months based on range
    let numMonths = 12;
    if (range === '7d' || range === '30d' || range === '90d') {
      numMonths = range === '7d' ? 1 : range === '30d' ? 2 : 4;
    }
    
    for (let i = numMonths - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      result.push(
        monthlyMap.get(key) || { month: key, income: 0, expense: 0 }
      );
    }

    return result;
  }

  /**
   * Most recent financial records.
   */
  static async getRecentActivity(limit: number = 10, range?: DateRange) {
    const dateFilter = range ? { date: getDateRange(range) } : {};
    
    const records = await prisma.financialRecord.findMany({
      where: { isDeleted: false, ...dateFilter },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    return records;
  }
}
