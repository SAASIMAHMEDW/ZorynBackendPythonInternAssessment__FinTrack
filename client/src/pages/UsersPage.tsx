import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { usersApi } from '../api/users';
import toast from 'react-hot-toast';
import type { UserFilters, Role, Status } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import { UsersHeader } from '../components/users/UsersHeader';
import { UsersTable } from '../components/users/UsersTable';
import { EditUserModal } from '../components/users/EditUserModal';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilters = useMemo(() => {
    return {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 15,
      role: (searchParams.get('role') as Role) || undefined,
      status: (searchParams.get('status') as Status) || undefined,
      search: searchParams.get('search') || undefined,
    };
  }, []);

  const [filters, setFilters] = useState<UserFilters>(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.page && filters.page > 1) params.page = filters.page.toString();
    if (filters.search) params.search = filters.search;
    if (filters.role) params.role = filters.role;
    if (filters.status) params.status = filters.status;
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    setFilters((p) => ({ ...p, search: debouncedSearch || undefined, page: 1 }));
  }, [debouncedSearch]);

  const [editModal, setEditModal] = useState<{
    id: string;
    role: Role;
    status: Status;
    name: string;
  } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.getAll(filters),
    staleTime: 10 * 60 * 1000,
  });

  const users = data?.data || [];
  const pagination = data?.pagination;

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string; role?: Role; status?: Status }) =>
      usersApi.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User updated');
      setEditModal(null);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Update failed'),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => usersApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deactivated');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed'),
  });

  const handleEdit = (edit: { id: string; role: Role; status: Status; name: string }) => {
    setEditModal(edit);
  };

  const handleSave = (id: string, role: Role, status: Status) => {
    updateMutation.mutate({ id, role, status });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-10">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[120px] bg-violet-500" />
      </div>

      <UsersHeader
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <UsersTable
        users={users}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDeactivate={(id) => deactivateMutation.mutate(id)}
      />

      <EditUserModal
        isOpen={!!editModal}
        user={editModal}
        isPending={updateMutation.isPending}
        onClose={() => setEditModal(null)}
        onSave={handleSave}
      />
    </div>
  );
}
