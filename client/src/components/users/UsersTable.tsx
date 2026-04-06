import { Users, UserX } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { UserWithCount, Role, Status, PaginationMeta } from '../../types';
import { Badge } from '../ui';
import { ROLES, STATUS } from '../ui/constants';

interface UsersTableProps {
  users: UserWithCount[];
  pagination?: PaginationMeta;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (user: { id: string; role: Role; status: Status; name: string }) => void;
  onDeactivate: (id: string) => void;
}

export function UsersTable({ users, pagination, isLoading, onPageChange, onEdit, onDeactivate }: UsersTableProps) {
  return (
    <div className="bg-surface-50 dark:bg-slate-900 backdrop-blur-xl border border-surface-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-200 dark:border-white/5 bg-surface-100/50 dark:bg-slate-800/50">
              <th className="text-left px-6 py-4 font-medium tracking-wide text-xs uppercase text-slate-500 dark:text-slate-400">User</th>
              <th className="text-left px-6 py-4 font-medium tracking-wide text-xs uppercase text-slate-500 dark:text-slate-400 hidden md:table-cell">Email</th>
              <th className="text-left px-6 py-4 font-medium tracking-wide text-xs uppercase text-slate-500 dark:text-slate-400">Role</th>
              <th className="text-left px-6 py-4 font-medium tracking-wide text-xs uppercase text-slate-500 dark:text-slate-400">Status</th>
              <th className="text-left px-6 py-4 font-medium tracking-wide text-xs uppercase text-slate-500 dark:text-slate-400 hidden lg:table-cell">Joined</th>
              <th className="text-right px-6 py-4 font-medium tracking-wide text-xs uppercase text-slate-500 dark:text-slate-400 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-200 dark:divide-white/5">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="w-40 h-10 bg-surface-200 dark:bg-slate-700/50 rounded-xl" /></td>
                  <td className="px-6 py-4 hidden md:table-cell"><div className="w-48 h-6 bg-surface-200 dark:bg-slate-700/50 rounded-md" /></td>
                  <td className="px-6 py-4"><div className="w-24 h-6 bg-surface-200 dark:bg-slate-700/50 rounded-md" /></td>
                  <td className="px-6 py-4"><div className="w-24 h-6 bg-surface-200 dark:bg-slate-700/50 rounded-md" /></td>
                  <td className="px-6 py-4 hidden lg:table-cell"><div className="w-28 h-6 bg-surface-200 dark:bg-slate-700/50 rounded-md" /></td>
                  <td className="px-6 py-4"><div className="w-20 h-8 bg-surface-200 dark:bg-slate-700/50 rounded-lg ml-auto" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-20 text-surface-400 dark:text-slate-400 font-medium">
                  <div className="flex flex-col items-center justify-center opacity-50">
                    <Users size={32} className="mb-4" />
                    No users found matching your criteria.
                  </div>
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="bg-surface-50 dark:bg-transparent hover:bg-surface-100 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 dark:from-violet-500/20 dark:to-indigo-500/20 border border-violet-500/10 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-300 font-bold tracking-wider flex-shrink-0">
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <span className="font-display font-bold text-surface-900 dark:text-slate-200">
                        {u.firstName} {u.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-surface-500 dark:text-slate-400 font-medium">
                    {u.email}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={ROLES[u.role].variant}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={STATUS[u.status].variant}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-surface-500 dark:text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit({ id: u.id, role: u.role, status: u.status, name: `${u.firstName} ${u.lastName}` })}
                        className="px-3 py-1.5 bg-surface-100 dark:bg-slate-800 text-surface-600 dark:text-slate-300 hover:text-surface-900 dark:hover:text-white hover:bg-surface-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-surface-200 dark:border-white/5 font-semibold text-xs tracking-wide"
                      >
                        Edit
                      </button>
                      {u.status === 'ACTIVE' && (
                        <button
                          onClick={() => {
                            if (confirm(`Deactivate ${u.firstName} ${u.lastName}?`)) {
                              onDeactivate(u.id);
                            }
                          }}
                          className="p-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-500/20"
                          title="Deactivate"
                        >
                          <UserX size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-100/30 dark:bg-slate-900/30 backdrop-blur-md p-4 border-t border-surface-200 dark:border-white/5">
          <p className="text-sm font-medium text-surface-500 dark:text-slate-400">
            Showing <span className="text-surface-900 dark:text-white">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="text-surface-900 dark:text-white">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-surface-900 dark:text-white">{pagination.total}</span> users
          </p>
          <div className="flex items-center gap-1 bg-surface-200/50 dark:bg-slate-950/50 p-1 rounded-xl border border-surface-200 dark:border-white/5">
            <button onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page <= 1} className="p-2 text-surface-500 dark:text-slate-400 hover:text-surface-900 dark:hover:text-white disabled:opacity-30 disabled:hover:text-surface-400 rounded-lg transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="px-4 text-sm font-bold text-surface-900 dark:text-white bg-surface-100 dark:bg-slate-800 py-1.5 rounded-lg border border-surface-200 dark:border-white/5 shadow-inner">
              {pagination.page} <span className="opacity-40 font-normal">/ {pagination.totalPages}</span>
            </span>
            <button onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="p-2 text-surface-500 dark:text-slate-400 hover:text-surface-900 dark:hover:text-white disabled:opacity-30 disabled:hover:text-surface-400 rounded-lg transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
