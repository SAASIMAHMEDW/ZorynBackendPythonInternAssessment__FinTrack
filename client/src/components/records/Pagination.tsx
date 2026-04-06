import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationMeta } from '../../types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-100/30 dark:bg-slate-900/30 backdrop-blur-md p-4 rounded-2xl border border-black/5 dark:border-white/5">
      <p className="text-sm font-medium text-surface-500 dark:text-slate-400">
        Showing <span className="text-surface-900 dark:text-white">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="text-surface-900 dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-surface-900 dark:text-white">{pagination.total}</span> records
      </p>
      <div className="flex items-center gap-1 bg-surface-200/50 dark:bg-slate-950/50 p-1 rounded-xl border border-black/5 dark:border-white/5">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page <= 1}
          className="p-2 text-surface-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-white disabled:opacity-30 disabled:hover:text-surface-400 rounded-lg transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
          let pageNum: number;
          if (pagination.totalPages <= 5) pageNum = i + 1;
          else if (pagination.page <= 3) pageNum = i + 1;
          else if (pagination.page >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
          else pageNum = pagination.page - 2 + i;
          
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                pagination.page === pageNum
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'text-surface-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-white hover:bg-surface-300 dark:hover:bg-slate-800'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page >= pagination.totalPages}
          className="p-2 text-surface-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-white disabled:opacity-30 disabled:hover:text-surface-400 rounded-lg transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
