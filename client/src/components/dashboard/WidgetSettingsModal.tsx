import React from 'react';
import type { DashboardLayoutItem, ChartConfig } from '../../types';
import { getWidgetDefinition, WIDGET_REGISTRY } from './widgetRegistry';
import { CHART_TYPE_OPTIONS, FORMULA_OPTIONS } from '../ui/constants';

interface WidgetSettingsModalProps {
  isOpen: boolean;
  widgetId: string | null;
  layouts: DashboardLayoutItem[];
  charts: ChartConfig[];
  onClose: () => void;
  onUpdateChart: (id: string, updates: Partial<ChartConfig>) => void;
  onUpdateLayout: (id: string, updates: Partial<DashboardLayoutItem>) => void;
}

export function WidgetSettingsModal({
  isOpen,
  widgetId,
  layouts,
  charts,
  onClose,
  onUpdateChart,
  onUpdateLayout,
}: WidgetSettingsModalProps) {
  if (!isOpen || !widgetId) return null;

  const item = layouts.find(l => l.i === widgetId);
  const chartConfig = charts.find(c => c.id === widgetId);
  const def = item ? getWidgetDefinition(item) : null;

  if (!item || !def) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
        <div className="bg-surface-50 dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-surface-200 dark:border-white/10 p-6">
          <p className="text-sm text-slate-500">Widget not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-surface-50 dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-surface-200 dark:border-white/10 overflow-hidden">
        <div className="p-6 border-b border-surface-200 dark:border-white/5 flex justify-between items-center bg-surface-100/50 dark:bg-white/5">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">Edit Widget</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Widget Title</label>
            <input
              type="text"
              value={chartConfig?.title || def.getTitle(item, chartConfig)}
              onChange={(e) => {
                if (chartConfig) onUpdateChart(widgetId, { title: e.target.value });
              }}
              disabled={!chartConfig}
              className="w-full px-4 py-2 bg-surface-100 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl text-surface-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
            />
            {!chartConfig && <p className="text-[10px] text-slate-500 mt-1">This widget type has a fixed title</p>}
          </div>
          
          {def.hasChartConfig && chartConfig && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Chart Type</label>
                <select
                  value={chartConfig.type}
                  onChange={(e) => onUpdateChart(widgetId, { type: e.target.value as ChartConfig['type'] })}
                  className="w-full px-4 py-2 bg-surface-100 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl text-surface-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {CHART_TYPE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Formula</label>
                <select
                  value={chartConfig.formula?.type || 'sum'}
                  onChange={(e) => onUpdateChart(widgetId, { formula: { type: e.target.value as any, field: 'amount' } })}
                  className="w-full px-4 py-2 bg-surface-100 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl text-surface-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {FORMULA_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Width</label>
              <input
                type="number"
                min={2}
                max={12}
                value={item.w}
                onChange={(e) => onUpdateLayout(widgetId, { w: parseInt(e.target.value) || 2 })}
                className="w-full px-4 py-2 bg-surface-100 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl text-surface-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Height</label>
              <input
                type="number"
                min={2}
                max={12}
                value={item.h}
                onChange={(e) => onUpdateLayout(widgetId, { h: parseInt(e.target.value) || 2 })}
                className="w-full px-4 py-2 bg-surface-100 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl text-surface-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-xl transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
