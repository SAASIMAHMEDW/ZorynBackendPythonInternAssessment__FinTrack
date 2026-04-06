import React from 'react';
import { TrendingUp, CreditCard, DollarSign, Hash, Activity, PieChart, Layers } from 'lucide-react';
import { ChartRenderer } from './ChartRenderer';
import { SummaryCard, type SummaryType } from './SummaryCard';
import { RecentActivityList } from './RecentActivityList';
import { CategoryBreakdown } from './CategoryBreakdown';
import type { DashboardLayoutItem, ChartConfig } from '../../types';

export type WidgetType = 'summary-income' | 'summary-expense' | 'summary-balance' | 'summary-records' | 'trends' | 'categories' | 'recent';

export interface WidgetDefinition {
  type: WidgetType;
  icon: React.ReactNode;
  label: string;
  defaultSize: { w: number; h: number };
  hasChartConfig: boolean;
  render: (props: WidgetRenderProps) => React.ReactNode;
  getTitle: (item: DashboardLayoutItem, chartConfig?: ChartConfig) => string;
}

export interface WidgetRenderProps {
  summary?: any;
  trend?: any;
  category?: any;
  recent?: any;
  loadingSum?: boolean;
  loadingTrend?: boolean;
  loadingCat?: boolean;
  loadingRec?: boolean;
  chartConfig?: ChartConfig;
}

const WIDGET_REGISTRY: Record<WidgetType, WidgetDefinition> = {
  'summary-income': {
    type: 'summary-income',
    icon: <TrendingUp size={24} />,
    label: 'Income Summary',
    defaultSize: { w: 3, h: 2 },
    hasChartConfig: false,
    render: ({ summary, loadingSum }) => <SummaryCard type="income" value={summary?.totalIncome || 0} subValue={summary?.incomeCount || 0} loading={loadingSum} />,
    getTitle: () => 'INCOME SUMMARY',
  },
  'summary-expense': {
    type: 'summary-expense',
    icon: <CreditCard size={24} />,
    label: 'Expense Summary',
    defaultSize: { w: 3, h: 2 },
    hasChartConfig: false,
    render: ({ summary, loadingSum }) => <SummaryCard type="expense" value={summary?.totalExpenses || 0} subValue={summary?.expenseCount || 0} loading={loadingSum} />,
    getTitle: () => 'EXPENSE SUMMARY',
  },
  'summary-balance': {
    type: 'summary-balance',
    icon: <DollarSign size={24} />,
    label: 'Balance Summary',
    defaultSize: { w: 3, h: 2 },
    hasChartConfig: false,
    render: ({ summary, loadingSum }) => <SummaryCard type="balance" value={summary?.netBalance || 0} loading={loadingSum} />,
    getTitle: () => 'BALANCE SUMMARY',
  },
  'summary-records': {
    type: 'summary-records',
    icon: <Hash size={24} />,
    label: 'Records Count',
    defaultSize: { w: 3, h: 2 },
    hasChartConfig: false,
    render: ({ summary, loadingSum }) => <SummaryCard type="records" value={summary?.totalRecords || 0} loading={loadingSum} />,
    getTitle: () => 'RECORDS COUNT',
  },
  'trends': {
    type: 'trends',
    icon: <Activity size={24} />,
    label: 'Financial Trends',
    defaultSize: { w: 6, h: 4 },
    hasChartConfig: true,
    render: ({ trend, loadingTrend, chartConfig }) => (
      <ChartRenderer
        config={chartConfig || { id: 'trends', type: 'AREA', title: 'Trends', showLegend: true }}
        data={trend || []}
        isLoading={loadingTrend}
      />
    ),
    getTitle: (_, chartConfig) => chartConfig?.title?.toUpperCase() || 'FINANCIAL TRENDS',
  },
  'categories': {
    type: 'categories',
    icon: <PieChart size={24} />,
    label: 'Category Breakdown',
    defaultSize: { w: 6, h: 4 },
    hasChartConfig: true,
    render: ({ category }) => <CategoryBreakdown categoryData={category} />,
    getTitle: (_, chartConfig) => chartConfig?.title?.toUpperCase() || 'EXPENSE BREAKDOWN',
  },
  'recent': {
    type: 'recent',
    icon: <Layers size={24} />,
    label: 'Recent Activity',
    defaultSize: { w: 12, h: 4 },
    hasChartConfig: false,
    render: ({ recent, loadingRec }) => <RecentActivityList loading={loadingRec || false} recent={recent || []} />,
    getTitle: () => 'RECENT ACTIVITY',
  },
};

export { WIDGET_REGISTRY };

export function getWidgetDefinition(item: DashboardLayoutItem): WidgetDefinition | null {
  for (const def of Object.values(WIDGET_REGISTRY)) {
    if (item.i.startsWith(def.type)) return def;
  }
  return null;
}

export const WIDGET_TYPES = Object.keys(WIDGET_REGISTRY) as WidgetType[];
