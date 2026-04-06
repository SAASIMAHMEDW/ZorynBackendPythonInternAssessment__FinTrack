import React from 'react';

interface SaveLayoutModalProps {
  isOpen: boolean;
  name: string;
  isPending: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  onChange: (name: string) => void;
}

export function SaveLayoutModal({ isOpen, name, isPending, onClose, onSave, onChange }: SaveLayoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-surface-50 dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-surface-200 dark:border-white/10 overflow-hidden">
        <div className="p-6 border-b border-surface-200 dark:border-white/5 flex justify-between items-center bg-surface-100/50 dark:bg-white/5">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">Save Dashboard</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Dashboard Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter dashboard name"
              className="w-full px-4 py-2 bg-surface-100 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl text-surface-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-surface-200/50 dark:bg-white/5 hover:bg-surface-300 dark:hover:bg-white/10 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(name)}
              disabled={!name.trim() || isPending}
              className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-xl transition-all disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
