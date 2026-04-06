import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import { dashboardApi } from '../api/dashboard';
import type { DashboardConfig, DashboardLayoutItem, ChartConfig, DashboardSummary, CategoryBreakdown, TrendData, FinancialRecord } from '../types';
import { WIDGET_REGISTRY, getWidgetDefinition, type WidgetType } from '../components/dashboard/widgetRegistry';

interface UseDashboardReturn {
  config: DashboardConfig | undefined;
  isLoading: boolean;
  timeRange: string;
  dashboardId: string | null;
  layouts: DashboardLayoutItem[];
  charts: ChartConfig[];
  designs: DashboardConfig[];
  isEditing: boolean;
  isSaving: boolean;
  summary: DashboardSummary | undefined;
  trends: TrendData[];
  categories: CategoryBreakdown[];
  recent: FinancialRecord[];
  loadingSummary: boolean;
  loadingTrends: boolean;
  loadingCategories: boolean;
  loadingRecent: boolean;
  setTimeRange: (range: string) => void;
  setIsEditing: (editing: boolean) => void;
  addWidget: (type: WidgetType, config?: Partial<ChartConfig>) => void;
  removeWidget: (id: string) => void;
  updateChart: (id: string, updates: Partial<ChartConfig>) => void;
  updateLayout: (id: string, updates: Partial<DashboardLayoutItem>) => void;
  saveDashboard: (name: string) => void;
  createBlankDashboard: (name: string) => void;
  switchDashboard: (id: string | null) => void;
  deleteDashboard: (id: string) => void;
  openWidgetSettings: (id: string) => void;
  existingWidgetIds: Set<string>;
}

const DEFAULT_LAYOUT: DashboardLayoutItem[] = [
  { i: 'summary-income', x: 0, y: 0, w: 3, h: 2 },
  { i: 'summary-expense', x: 3, y: 0, w: 3, h: 2 },
  { i: 'summary-balance', x: 6, y: 0, w: 3, h: 2 },
  { i: 'summary-records', x: 9, y: 0, w: 3, h: 2 },
  { i: 'trends', x: 0, y: 2, w: 6, h: 4 },
  { i: 'categories', x: 6, y: 2, w: 6, h: 4 },
  { i: 'recent', x: 0, y: 6, w: 12, h: 4 },
];

const DEFAULT_CHARTS: ChartConfig[] = [
  { id: 'trends', type: 'AREA', title: 'Financial Trends', showLegend: true },
  { id: 'categories', type: 'PIE', title: 'Expense Breakdown', showLegend: true },
];

export function useDashboard(): UseDashboardReturn {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const timeRange = searchParams.get('range') || '7d';
  const dashboardId = searchParams.get('dashboard');

  const [isEditing, setIsEditing] = useState(false);
  const [layouts, setLayouts] = useState<DashboardLayoutItem[]>(DEFAULT_LAYOUT);
  const [charts, setCharts] = useState<ChartConfig[]>(DEFAULT_CHARTS);
  
  // Track the original config id for saving
  const originalConfigIdRef = useRef<string | undefined>(undefined);

  const { data: config, isLoading } = useQuery({
    queryKey: ['dashboard-config', dashboardId],
    queryFn: async () => {
      const params = dashboardId ? { id: dashboardId } : {};
      const res = await api.get('/dashboard/config', { params });
      return res.data.data as DashboardConfig;
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  const { data: designs = [] } = useQuery({
    queryKey: ['dashboard-designs'],
    queryFn: async () => {
      const res = await api.get('/dashboard/config/list');
      return res.data.data as DashboardConfig[];
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  const { data: summaryData, isLoading: loadingSummary } = useQuery({
    queryKey: ['dashboard-summary', timeRange],
    queryFn: async () => {
      const res = await dashboardApi.getSummary(timeRange);
      return res.data as DashboardSummary;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: trendsData = [], isLoading: loadingTrends } = useQuery({
    queryKey: ['dashboard-trends', timeRange],
    queryFn: async () => {
      const res = await dashboardApi.getTrends(timeRange);
      return res.data as TrendData[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: categoriesData = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['dashboard-categories', timeRange],
    queryFn: async () => {
      const res = await dashboardApi.getCategoryBreakdown(timeRange);
      return res.data as CategoryBreakdown[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: recentData = [], isLoading: loadingRecent } = useQuery({
    queryKey: ['dashboard-recent', timeRange],
    queryFn: async () => {
      const res = await dashboardApi.getRecentActivity(timeRange);
      return res.data as FinancialRecord[];
    },
    staleTime: 1 * 60 * 1000,
  });

  const saveMutation = useMutation({
    mutationFn: async (newConfig: Partial<DashboardConfig>) => {
      return api.post('/dashboard/config', newConfig);
    },
    onSuccess: (response) => {
      // Invalidate and refetch both queries
      queryClient.invalidateQueries({ queryKey: ['dashboard-config'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-designs'] });
      setIsEditing(false);
      
      // If this was a new dashboard, update the search params to switch to it
      const newId = response.data?.data?.id;
      if (newId && !dashboardId) {
        setSearchParams({ dashboard: newId });
      }
    },
  });

  const createBlankMutation = useMutation({
    mutationFn: async (name: string) => {
      return api.post('/dashboard/config', {
        name: name || 'New Dashboard',
        layout: [],
        charts: [],
      });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-config'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-designs'] });
      
      // Switch to the newly created dashboard
      const newId = response.data?.data?.id;
      if (newId) {
        setSearchParams({ dashboard: newId });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/dashboard/config/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-designs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-config'] });
    },
  });

  // Update local state when config changes and track original id
  useEffect(() => {
    if (config) {
      setLayouts((config.layout as DashboardLayoutItem[]) || DEFAULT_LAYOUT);
      setCharts(config.charts || DEFAULT_CHARTS);
      originalConfigIdRef.current = config.id;
    }
  }, [config]);

  // Reset editing mode when switching dashboards
  useEffect(() => {
    setIsEditing(false);
  }, [dashboardId]);

  const setTimeRange = useCallback((range: string) => {
    setSearchParams(prev => {
      prev.set('range', range);
      return prev;
    });
  }, [setSearchParams]);

  const addWidget = useCallback((type: WidgetType, config?: Partial<ChartConfig>) => {
    const id = `${type}-${Date.now()}`;
    const def = WIDGET_REGISTRY[type];
    const newItem: DashboardLayoutItem = {
      i: id,
      x: 0,
      y: Infinity,
      w: def.defaultSize.w,
      h: def.defaultSize.h,
    };

    setLayouts(prev => [...prev, newItem]);
    
    if (def.hasChartConfig) {
      setCharts(prev => [...prev, {
        id,
        type: config?.type || 'AREA',
        title: config?.title || def.label,
        showLegend: true,
        formula: config?.formula,
      }]);
    }
  }, []);

  const removeWidget = useCallback((id: string) => {
    setLayouts(prev => prev.filter(item => item.i !== id));
    setCharts(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateChart = useCallback((id: string, updates: Partial<ChartConfig>) => {
    setCharts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const updateLayout = useCallback((id: string, updates: Partial<DashboardLayoutItem>) => {
    setLayouts(prev => prev.map(l => l.i === id ? { ...l, ...updates } : l));
  }, []);

  const saveDashboard = useCallback((name: string) => {
    // Only pass id if it's not 'default' and not already saved as a new dashboard
    const configId = originalConfigIdRef.current;
    
    saveMutation.mutate({
      ...(configId && configId !== 'default' ? { id: configId } : {}),
      name: name || 'My Dashboard',
      layout: layouts as DashboardLayoutItem[],
      charts,
    });
  }, [layouts, charts, saveMutation]);

  const createBlankDashboard = useCallback((name: string) => {
    createBlankMutation.mutate(name || 'New Dashboard');
  }, [createBlankMutation]);

  const switchDashboard = useCallback((id: string | null) => {
    if (id) {
      setSearchParams({ dashboard: id });
    } else {
      setSearchParams({});
    }
    setIsEditing(false);
  }, [setSearchParams]);

  const deleteDashboard = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  const openWidgetSettings = useCallback(() => {
    setIsEditing(true);
  }, []);

  const existingWidgetIds = useMemo(() => {
    return new Set(layouts.map(item => {
      const def = getWidgetDefinition(item);
      return def?.type || item.i;
    }));
  }, [layouts]);

  return {
    config,
    isLoading,
    timeRange,
    dashboardId,
    layouts,
    charts,
    designs,
    isEditing,
    isSaving: saveMutation.isPending || createBlankMutation.isPending,
    summary: summaryData,
    trends: trendsData,
    categories: categoriesData,
    recent: recentData,
    loadingSummary,
    loadingTrends,
    loadingCategories,
    loadingRecent,
    setTimeRange,
    setIsEditing,
    addWidget,
    removeWidget,
    updateChart,
    updateLayout,
    saveDashboard,
    createBlankDashboard,
    switchDashboard,
    deleteDashboard,
    openWidgetSettings,
    existingWidgetIds,
  };
}
