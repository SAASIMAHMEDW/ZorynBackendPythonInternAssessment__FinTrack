import { Search } from 'lucide-react';
import type { Role, Status, UserFilters } from '../../types';
import { Select } from '../ui';

interface UsersHeaderProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

export function UsersHeader({ searchInput, onSearchChange, filters, onFiltersChange }: UsersHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600 dark:text-violet-400">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h1 className="text-4xl font-display font-black tracking-tight text-surface-900 dark:text-surface-50 drop-shadow-sm">
            Team Access
          </h1>
        </div>
        <p className="text-surface-500 dark:text-surface-400 font-medium ml-1">Manage platform users and permissions</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div className="relative w-full sm:w-72 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 group-focus-within:text-violet-500 transition-colors" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-surface-100/50 dark:bg-slate-900/50 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 shadow-inner transition-all font-medium"
            placeholder="Search users..."
          />
        </div>

        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:w-36">
            <Select
              value={filters.role || ''}
              onChange={(e) => onFiltersChange({ ...filters, role: (e.target.value as Role) || undefined, page: 1 })}
              options={[
                { value: '', label: 'All Roles' },
                { value: 'ADMIN', label: 'Admin' },
                { value: 'ANALYST', label: 'Analyst' },
                { value: 'VIEWER', label: 'Viewer' },
              ]}
            />
          </div>

          <div className="relative flex-1 sm:w-36">
            <Select
              value={filters.status || ''}
              onChange={(e) => onFiltersChange({ ...filters, status: (e.target.value as Status) || undefined, page: 1 })}
              options={[
                { value: '', label: 'All Status' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
