import { ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from 'lucide-react';
import type { FinancialRecord } from '../../types';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

interface RecordTableProps {
  isLoading: boolean;
  records: FinancialRecord[];
  isAdmin: boolean;
  onEdit: (record: FinancialRecord) => void;
  onDelete: (id: string) => void;
}

export function RecordTable({ isLoading, records, isAdmin, onEdit, onDelete }: RecordTableProps) {
  return (
    <div className="bg-surface-50 dark:bg-slate-900 backdrop-blur-xl border border-surface-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-200 dark:border-white/5 bg-surface-100 dark:bg-slate-800/50">
              <th className="text-left px-6 py-4 font-medium tracking-wide text-xs uppercase text-slate-500 dark:text-slate-400">Type</th>
              <th className="text-left px-6 py-4 font-medium tracking-wide text-xs uppercase text-slate-500 dark:text-slate-400">Category</th>
              <th className="text-left px-6 py-4 font-medium tracking-wide text-xs uppercase text-slate-500 dark:text-slate-400 hidden md:table-cell">Description</th>
              <th className="text-left px-6 py-4 font-medium tracking-wide text-xs uppercase text-slate-500 dark:text-slate-400">Date</th>
              <th className="text-right px-6 py-4 font-medium tracking-wide text-xs uppercase text-slate-500 dark:text-slate-400">Amount</th>
              {isAdmin && <th className="text-right px-6 py-4 font-medium tracking-wide text-xs uppercase text-slate-500 dark:text-slate-400 w-24">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 dark:divide-white/5">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="w-20 h-6 bg-surface-200 dark:bg-slate-700 rounded-md" /></td>
                  <td className="px-6 py-4"><div className="w-24 h-6 bg-surface-200 dark:bg-slate-700 rounded-md" /></td>
                  <td className="px-6 py-4 hidden md:table-cell"><div className="w-48 h-6 bg-surface-200 dark:bg-slate-700 rounded-md" /></td>
                  <td className="px-6 py-4"><div className="w-24 h-6 bg-surface-200 dark:bg-slate-700 rounded-md" /></td>
                  <td className="px-6 py-4"><div className="w-24 h-6 bg-surface-200 dark:bg-slate-700 rounded-md ml-auto" /></td>
                  {isAdmin && <td className="px-6 py-4"><div className="w-16 h-6 bg-surface-200 dark:bg-slate-700 rounded-md ml-auto" /></td>}
                </tr>
              ))
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="text-center py-20 text-slate-400 font-medium">
                  <div className="flex flex-col items-center justify-center opacity-50">
                    <Trash2 size={32} className="mb-4" />
                    No records found matching your criteria.
                  </div>
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="bg-surface-50 dark:bg-transparent hover:bg-surface-100 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide border ${
                      r.type === 'INCOME'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
                    }`}>
                      {r.type === 'INCOME' ? <ArrowUpRight size={14} className="mr-1.5" /> : <ArrowDownRight size={14} className="mr-1.5" />}
                      {r.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
                    {r.category}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-slate-500 dark:text-slate-400 max-w-xs truncate">
                    {r.description || '—'}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className={`px-6 py-4 text-right font-display font-semibold ${
                    r.type === 'INCOME'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {r.type === 'INCOME' ? '+' : '-'}{fmt(Number(r.amount))}
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(r)} className="p-2 bg-surface-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white hover:bg-surface-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-surface-200 dark:border-white/5" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => onDelete(r.id)} className="p-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/20" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
