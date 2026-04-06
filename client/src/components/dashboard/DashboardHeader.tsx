import React from 'react';
import { Layout as LayoutIcon, Edit3, Plus, Settings2, Save, RotateCcw, Activity } from 'lucide-react';

interface DashboardHeaderProps {
  name: string;
  timeRange: string;
  canEdit: boolean;
  isEditing: boolean;
  isSaving: boolean;
  onTimeRangeChange: (range: string) => void;
  onToggleEdit: () => void;
  onAddWidget: () => void;
  onCancel: () => void;
  onSave: () => void;
  onSwitchDashboard: () => void;
}

const TIME_RANGES = [
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: 'ytd', label: 'Year to Date' },
];

export function DashboardHeader({
  name,
  timeRange,
  canEdit,
  isEditing,
  isSaving,
  onTimeRangeChange,
  onToggleEdit,
  onAddWidget,
  onCancel,
  onSave,
  onSwitchDashboard,
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center bg-surface-50/50 dark:bg-slate-900/40 backdrop-blur-xl p-4 rounded-2xl border border-surface-200/50 dark:border-white/5 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium ml-2">
          <LayoutIcon size={16} />
          <span>{name}</span>
        </div>
        
        {canEdit && (
          <button
            onClick={onSwitchDashboard}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <Settings2 size={12} /> Switch Dashboard
          </button>
        )}
      </div>

      <div className="flex gap-1 bg-surface-100 dark:bg-slate-800/50 p-1 rounded-xl">
        {TIME_RANGES.map(range => (
          <button
            key={range.value}
            onClick={() => onTimeRangeChange(range.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              timeRange === range.value
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-surface-200 dark:hover:bg-slate-700'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {canEdit && (
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={onAddWidget}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl border border-emerald-500/20 transition-all"
              >
                <Plus size={16} /> Add Component
              </button>
              <button
                onClick={onCancel}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-200/50 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl border border-surface-200 dark:border-white/5 transition-all"
              >
                <RotateCcw size={16} /> Cancel
              </button>
              <button
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-xl shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : <><Save size={16} /> Save Layout</>}
              </button>
            </>
          ) : (
            <button
              onClick={onToggleEdit}
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-white bg-sky-500/10 hover:bg-sky-500/20 rounded-xl border border-sky-500/30 dark:border-sky-500/20 transition-all"
            >
              <Edit3 size={16} /> Customize Dashboard
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface ViewerHeaderProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export function ViewerHeader({ timeRange, onTimeRangeChange }: ViewerHeaderProps) {
  return (
    <div className="flex justify-between items-center bg-surface-50/50 dark:bg-slate-900/40 backdrop-blur-xl p-4 rounded-2xl border border-surface-200/50 dark:border-white/5 shadow-lg">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium ml-2">
        <Activity size={16} />
        <span>Recent Activity</span>
      </div>
      <div className="flex gap-1 bg-surface-100 dark:bg-slate-800/50 p-1 rounded-xl">
        {TIME_RANGES.map(range => (
          <button
            key={range.value}
            onClick={() => onTimeRangeChange(range.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              timeRange === range.value
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-surface-200 dark:hover:bg-slate-700'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
