import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import type { DashboardConfig } from '../../types';

interface SwitchDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboards: DashboardConfig[];
  currentDashboardId: string | null;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export function SwitchDashboardModal({ 
  isOpen, 
  onClose, 
  dashboards, 
  currentDashboardId, 
  onDelete, 
  onCreateNew 
}: SwitchDashboardModalProps) {
  const navigate = useNavigate();

  const handleSelect = (id: string | null) => {
    if (id) {
      navigate(`?dashboard=${id}`);
    } else {
      navigate('/');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-surface-50 dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-surface-200 dark:border-white/10 overflow-hidden">
        <div className="p-6 border-b border-surface-200 dark:border-white/5 flex justify-between items-center bg-surface-100/50 dark:bg-white/5">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">Switch Dashboard</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
        </div>
        <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
          <button
            onClick={() => handleSelect(null)}
            className={`w-full p-3 text-left border rounded-xl transition-all ${
              !currentDashboardId 
                ? 'border-sky-500 bg-sky-500/10' 
                : 'border-surface-200 dark:border-white/5 hover:bg-surface-100 dark:hover:bg-white/5'
            }`}
          >
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Default Dashboard</span>
          </button>
          {dashboards.map(d => (
            <div key={d.id} className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
              currentDashboardId === d.id 
                ? 'border-sky-500 bg-sky-500/10' 
                : 'border-surface-200 dark:border-white/5 hover:bg-surface-100 dark:hover:bg-white/5'
            }`}>
              <button 
                onClick={() => handleSelect(d.id)} 
                className="flex-1 text-left"
              >
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{d.name}</span>
                <p className="text-[10px] text-slate-500">Updated {new Date(d.updatedAt).toLocaleDateString()}</p>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(d.id); }}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <div className="pt-4 mt-4 border-t border-surface-200 dark:border-white/5">
            <button
              onClick={onCreateNew}
              className="w-full py-3 bg-sky-500 text-white rounded-xl text-sm font-bold hover:bg-sky-400 transition-all"
            >
              + Create New Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
