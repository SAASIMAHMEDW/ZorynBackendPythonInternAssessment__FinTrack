import { FileDigit, Search, Filter } from 'lucide-react';
import type { RecordFilters } from '../../types';

interface RecordsHeaderProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  isAdmin: boolean;
  onCreate: () => void;
}

export function RecordsHeader({ searchInput, onSearchChange, showFilters, onToggleFilters, isAdmin, onCreate }: RecordsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <FileDigit size={24} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-surface-900 dark:text-surface-50 drop-shadow-sm">
            Ledger Records
          </h1>
        </div>
        <p className="text-surface-500 dark:text-surface-400 font-medium ml-1">Manage and track your transactions</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div className="relative w-full sm:w-80 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-sky-500 transition-colors" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-surface-100/50 dark:bg-slate-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 shadow-inner transition-all font-medium"
            placeholder="Search description, category..."
          />
        </div>
        <div className="flex w-full sm:w-auto gap-3">
          <button 
            onClick={onToggleFilters} 
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all border ${showFilters ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20' : 'bg-surface-100/50 dark:bg-slate-900/50 text-surface-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white hover:bg-surface-200 dark:hover:bg-slate-800 border-black/5 dark:border-white/5'}`}
          >
            <Filter size={18} />
            <span className="hidden sm:inline">Filters</span>
          </button>

          {isAdmin && (
            <button onClick={onCreate} className="flex items-center justify-center gap-2 px-6 py-3 bg-surface-900 dark:bg-surface-100 text-white dark:text-surface-900 hover:bg-surface-800 dark:hover:bg-surface-200 font-bold rounded-xl transition-all shadow-xl shadow-black/10 dark:shadow-white/10 whitespace-nowrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Entry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
