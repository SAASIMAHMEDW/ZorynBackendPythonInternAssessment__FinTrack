import React, { useState, useMemo } from 'react';
import { WIDGET_REGISTRY, WIDGET_TYPES, type WidgetType } from './widgetRegistry';
import type { DashboardLayoutItem, ChartConfig } from '../../types';
import { CHART_TYPE_OPTIONS, FORMULA_OPTIONS } from '../ui/constants';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (type: WidgetType, config?: Partial<ChartConfig>) => void;
  existingWidgetIds: Set<string>;
}

export function AddWidgetModal({ isOpen, onClose, onConfirm, existingWidgetIds }: AddWidgetModalProps) {
  const [step, setStep] = useState<'type' | 'config'>('type');
  const [selectedType, setSelectedType] = useState<WidgetType | null>(null);
  const [widgetTitle, setWidgetTitle] = useState('');
  const [chartType, setChartType] = useState<string>('AREA');
  const [formula, setFormula] = useState<string>('sum');

  const handleSelectType = (type: WidgetType) => {
    setSelectedType(type);
    setWidgetTitle(WIDGET_REGISTRY[type].label);
    if (WIDGET_REGISTRY[type].hasChartConfig) {
      setStep('config');
    } else {
      onConfirm(type);
      resetAndClose();
    }
  };

  const handleConfirm = () => {
    if (!selectedType) return;
    const config = WIDGET_REGISTRY[selectedType].hasChartConfig
      ? { title: widgetTitle, type: chartType as ChartConfig['type'], formula: { type: formula as any, field: 'amount' } }
      : undefined;
    onConfirm(selectedType, config);
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep('type');
    setSelectedType(null);
    setWidgetTitle('');
    setChartType('AREA');
    setFormula('sum');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-surface-50 dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-surface-200 dark:border-white/10 overflow-hidden">
        <div className="p-6 border-b border-surface-200 dark:border-white/5 flex justify-between items-center bg-surface-100/50 dark:bg-white/5">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white">
            {step === 'type' ? 'Add Component' : `Configure ${selectedType ? WIDGET_REGISTRY[selectedType].label : ''}`}
          </h3>
          <button onClick={resetAndClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
        </div>
        
        <div className="p-6">
          {step === 'type' ? (
            <>
              <p className="text-sm text-slate-500 mb-4">Select component type:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {WIDGET_TYPES.map(type => {
                  const isAdded = existingWidgetIds.has(type);
                  return (
                    <button
                      key={type}
                      onClick={() => !isAdded && handleSelectType(type)}
                      disabled={isAdded}
                      className={`p-4 text-center border rounded-xl transition-all ${
                        isAdded 
                          ? 'border-surface-200 dark:border-white/5 opacity-50 cursor-not-allowed'
                          : 'border-surface-200 dark:border-white/5 hover:bg-sky-500/5 hover:border-sky-500/30'
                      }`}
                    >
                      <div className="flex justify-center mb-2 text-slate-600 dark:text-slate-300">
                        {WIDGET_REGISTRY[type].icon}
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200 block">
                        {WIDGET_REGISTRY[type].label}
                      </span>
                      {isAdded && <span className="text-[10px] text-emerald-500 mt-1 block">Added</span>}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Widget Title</label>
                <input
                  type="text"
                  value={widgetTitle}
                  onChange={(e) => setWidgetTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-100 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl text-surface-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Chart Type</label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
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
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-100 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl text-surface-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {FORMULA_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep('type')}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-surface-200/50 dark:bg-white/5 hover:bg-surface-300 dark:hover:bg-white/10 rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-400 rounded-xl transition-all"
                >
                  Add Widget
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
