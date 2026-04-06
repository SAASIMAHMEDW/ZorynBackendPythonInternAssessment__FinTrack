import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { FinancialRecord } from '../../types';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

interface RecentActivityListProps {
  loading: boolean;
  recent: FinancialRecord[];
}

export function RecentActivityList({ loading, recent }: RecentActivityListProps) {
  return (
    <div className="bg-surface-50/50 dark:bg-slate-900/40 backdrop-blur-xl border border-surface-200/50 dark:border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden h-full flex flex-col">
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-3xl -mr-10 -mb-10 pointer-events-none" />
      <h3 className="text-lg font-display font-semibold text-surface-700 dark:text-white mb-6 tracking-tight relative z-10">
        Recent Activity
      </h3>
      
      {loading ? (
        <div className="space-y-4 relative z-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse p-3">
              <div className="w-12 h-12 bg-surface-200 dark:bg-slate-700/50 rounded-xl" />
              <div className="flex-1">
                <div className="w-32 h-4 bg-surface-200 dark:bg-slate-700/50 rounded mb-2" />
                <div className="w-24 h-3 bg-surface-200 dark:bg-slate-700/50 rounded" />
              </div>
              <div className="w-20 h-5 bg-surface-200 dark:bg-slate-700/50 rounded" />
            </div>
          ))}
        </div>
      ) : recent.length === 0 ? (
        <p className="text-sm text-surface-500 dark:text-slate-400 text-center py-8 relative z-10">No recent activity</p>
      ) : (
        <div className="space-y-1 relative z-10 overflow-y-auto flex-1 pr-2 custom-scrollbar min-h-0">
          {recent.map((record) => (
            <div
              key={record.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-100/50 dark:hover:bg-slate-800/30 transition-colors group cursor-default"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border ${
                  record.type === 'INCOME'
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/10 border-emerald-500/20 dark:border-emerald-500/20'
                    : 'bg-rose-500/10 dark:bg-rose-500/10 border-rose-500/20 dark:border-rose-500/20'
                }`}
              >
                {record.type === 'INCOME' ? (
                  <ArrowUpRight size={20} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowDownRight size={20} className="text-rose-600 dark:text-rose-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-700 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-100 transition-colors">
                  {record.category}
                </p>
                <p className="text-xs text-surface-500 dark:text-slate-400 truncate mt-0.5">
                  {record.description || 'No description'} <span className="opacity-50 mx-1">•</span> {new Date(record.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}
                </p>
              </div>
              <span
                className={`text-sm font-semibold whitespace-nowrap ${
                  record.type === 'INCOME'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {record.type === 'INCOME' ? '+' : '-'}
                {fmt(Number(record.amount))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
