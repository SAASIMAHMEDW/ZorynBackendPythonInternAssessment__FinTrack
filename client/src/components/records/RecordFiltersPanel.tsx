import { Select } from '../ui';
import { CATEGORIES } from '../ui/constants';
import type { RecordFilters, TransactionType } from '../../types';

interface RecordFiltersPanelProps {
  filters: RecordFilters;
  setFilters: React.Dispatch<React.SetStateAction<RecordFilters>>;
}

export function RecordFiltersPanel({ filters, setFilters }: RecordFiltersPanelProps) {
  const categoryOptions = CATEGORIES.ALL.map(c => ({ value: c, label: c }));

  return (
    <div className="bg-surface-50 dark:bg-slate-900 backdrop-blur-xl border border-surface-200 dark:border-white/5 rounded-2xl p-6 shadow-xl animate-fade-in relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent pointer-events-none" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
      
        <div>
          <label className="block text-xs font-semibold text-surface-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Type
          </label>
          <Select
            value={filters.type || ''}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                type: (e.target.value as TransactionType) || undefined,
                page: 1,
              }))
            }
            options={[
              { value: '', label: 'All Types' },
              { value: 'INCOME', label: 'Income' },
              { value: 'EXPENSE', label: 'Expense' },
            ]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-surface-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Category
          </label>
          <Select
            value={filters.category || ''}
            onChange={(e) =>
              setFilters((p) => ({ ...p, category: e.target.value || undefined, page: 1 }))
            }
            options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-surface-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) =>
              setFilters((p) => ({ ...p, startDate: e.target.value || undefined, page: 1 }))
            }
            className="w-full bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-surface-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-medium text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-surface-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) =>
              setFilters((p) => ({ ...p, endDate: e.target.value || undefined, page: 1 }))
            }
            className="w-full bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-surface-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-medium text-sm"
          />
        </div>
      </div>
    </div>
  );
}
