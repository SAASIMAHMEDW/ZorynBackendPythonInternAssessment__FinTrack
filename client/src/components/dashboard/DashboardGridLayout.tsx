import React, { useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import type { Role, DashboardLayoutItem } from '../../types';
import { WidgetWrapper } from './WidgetWrapper';
import { getWidgetDefinition, type WidgetRenderProps, type WidgetType } from './widgetRegistry';
import { RecentActivityList } from './RecentActivityList';
import { DashboardHeader, ViewerHeader } from './DashboardHeader';
import { AddWidgetModal } from './AddWidgetModal';
import { SwitchDashboardModal } from './SwitchDashboardModal';
import { WidgetSettingsModal } from './WidgetSettingsModal';
import { useDashboard } from '../../hooks/useDashboard';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridLayoutProps {
  userRole: Role;
}

export function DashboardGridLayout({ userRole }: DashboardGridLayoutProps) {
  const canEdit = userRole === 'ADMIN' || userRole === 'ANALYST';
  
  const {
    config,
    isLoading,
    timeRange,
    dashboardId,
    layouts,
    charts,
    designs,
    isEditing,
    isSaving,
    summary,
    trends,
    categories,
    recent,
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
    existingWidgetIds,
  } = useDashboard();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);

  const handleCreateNew = useCallback(() => {
    setShowSwitchModal(false);
    createBlankDashboard('New Dashboard');
  }, [createBlankDashboard]);

  const handleSave = useCallback(() => {
    saveDashboard(config?.name || 'My Dashboard');
  }, [saveDashboard, config]);

  const renderWidget = useCallback((item: any) => {
    const def = getWidgetDefinition(item);
    if (!def) return null;

    const chartConfig = charts.find(c => c.id === item.i);
    const title = def.getTitle(item, chartConfig);

    let renderProps: WidgetRenderProps;
    
    if (def.type === 'summary-income' || def.type === 'summary-expense' || def.type === 'summary-balance' || def.type === 'summary-records') {
      renderProps = {
        summary,
        loadingSum: loadingSummary,
        chartConfig,
      };
    } else if (def.type === 'trends') {
      renderProps = {
        trend: trends,
        loadingTrend: loadingTrends,
        chartConfig,
      };
    } else if (def.type === 'categories') {
      renderProps = {
        category: categories,
        loadingCat: loadingCategories,
        chartConfig,
      };
    } else if (def.type === 'recent') {
      renderProps = {
        recent,
        loadingRec: loadingRecent,
        chartConfig,
      };
    } else {
      renderProps = { chartConfig };
    }

    return (
      <div key={item.i}>
        <WidgetWrapper
          id={item.i}
          title={title}
          isEditing={isEditing}
          handleClass="drag-handle"
          onRemove={canEdit ? () => removeWidget(item.i) : undefined}
          onSettings={canEdit ? () => setEditingWidgetId(item.i) : undefined}
        >
          {def.render(renderProps)}
        </WidgetWrapper>
      </div>
    );
  }, [charts, isEditing, canEdit, removeWidget, summary, trends, categories, recent, loadingSummary, loadingTrends, loadingCategories, loadingRecent]);

  const dataLoading = isLoading || loadingSummary || loadingTrends || loadingCategories || loadingRecent;

  if (dataLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sky-500/10 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  // ─── VIEWER VIEW ──────────────────────────────────────────
  if (!canEdit) {
    return (
      <div className="space-y-6">
        <ViewerHeader timeRange={timeRange} onTimeRangeChange={setTimeRange} />
        <RecentActivityList loading={loadingRecent} recent={recent} />
        <Modals {...{}} />
      </div>
    );
  }

  // ─── ADMIN/ANALYST VIEW ────────────────────────────────────
  return (
    <div className="space-y-6">
      <DashboardHeader
        name={config?.name || 'Default Dashboard'}
        timeRange={timeRange}
        canEdit={canEdit}
        isEditing={isEditing}
        isSaving={isSaving}
        onTimeRangeChange={setTimeRange}
        onToggleEdit={() => setIsEditing(true)}
        onAddWidget={() => setShowAddModal(true)}
        onCancel={() => setIsEditing(false)}
        onSave={handleSave}
        onSwitchDashboard={() => setShowSwitchModal(true)}
      />

      {layouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 bg-surface-50/50 dark:bg-slate-900/40 backdrop-blur-xl border border-surface-200/50 dark:border-white/5 rounded-2xl">
          <p className="text-surface-500 dark:text-slate-400 mb-4">No widgets on this dashboard</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-400 transition-all"
          >
            Add Widget
          </button>
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layouts }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          draggableHandle=".drag-handle"
          isDraggable={isEditing}
          isResizable={isEditing}
          onLayoutChange={(current: any) => {
            if (isEditing) {
              current.forEach((item: DashboardLayoutItem) => {
                updateLayout(item.i, { x: item.x, y: item.y, w: item.w, h: item.h });
              });
            }
          }}
          margin={[24, 24]}
        >
          {layouts.map(renderWidget)}
        </ResponsiveGridLayout>
      )}

      <Modals
        showAddModal={showAddModal}
        onCloseAddModal={() => setShowAddModal(false)}
        onAddWidget={addWidget}
        existingWidgetIds={existingWidgetIds}
        showSwitchModal={showSwitchModal}
        onCloseSwitchModal={() => setShowSwitchModal(false)}
        dashboards={designs}
        currentDashboardId={dashboardId}
        onDeleteDashboard={deleteDashboard}
        onCreateNew={handleCreateNew}
        editingWidgetId={editingWidgetId}
        onCloseWidgetSettings={() => setEditingWidgetId(null)}
        layouts={layouts}
        charts={charts}
        onUpdateChart={updateChart}
        onUpdateLayout={updateLayout}
      />
    </div>
  );
}

interface ModalsProps {
  showAddModal?: boolean;
  onCloseAddModal?: () => void;
  onAddWidget?: (type: WidgetType, config?: any) => void;
  existingWidgetIds?: Set<string>;
  showSwitchModal?: boolean;
  onCloseSwitchModal?: () => void;
  dashboards?: any[];
  currentDashboardId?: string | null;
  onDeleteDashboard?: (id: string) => void;
  onCreateNew?: () => void;
  editingWidgetId?: string | null;
  onCloseWidgetSettings?: () => void;
  layouts?: any[];
  charts?: any[];
  onUpdateChart?: (id: string, updates: any) => void;
  onUpdateLayout?: (id: string, updates: any) => void;
}

function Modals({
  showAddModal,
  onCloseAddModal,
  onAddWidget,
  existingWidgetIds,
  showSwitchModal,
  onCloseSwitchModal,
  dashboards,
  currentDashboardId,
  onDeleteDashboard,
  onCreateNew,
  editingWidgetId,
  onCloseWidgetSettings,
  layouts,
  charts,
  onUpdateChart,
  onUpdateLayout,
}: ModalsProps) {
  return (
    <>
      {showAddModal && onCloseAddModal && onAddWidget && existingWidgetIds && (
        <AddWidgetModal
          isOpen={showAddModal}
          onClose={onCloseAddModal}
          onConfirm={onAddWidget}
          existingWidgetIds={existingWidgetIds}
        />
      )}

      {showSwitchModal && onCloseSwitchModal && dashboards && onDeleteDashboard && onCreateNew && (
        <SwitchDashboardModal
          isOpen={showSwitchModal}
          onClose={onCloseSwitchModal}
          dashboards={dashboards}
          currentDashboardId={currentDashboardId || null}
          onDelete={onDeleteDashboard}
          onCreateNew={onCreateNew}
        />
      )}

      {editingWidgetId && onCloseWidgetSettings && layouts && charts && onUpdateChart && onUpdateLayout && (
        <WidgetSettingsModal
          isOpen={true}
          widgetId={editingWidgetId}
          layouts={layouts}
          charts={charts}
          onClose={onCloseWidgetSettings}
          onUpdateChart={onUpdateChart}
          onUpdateLayout={onUpdateLayout}
        />
      )}
    </>
  );
}
