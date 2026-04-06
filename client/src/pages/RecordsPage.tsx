import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { recordsApi } from '../api/records';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import type { RecordFilters, CreateRecordInput, UpdateRecordInput, FinancialRecord, TransactionType } from '../types';

import { RecordTable } from '../components/records/RecordTable';
import { RecordModal } from '../components/records/RecordModal';
import { DeleteConfirmModal } from '../components/records/DeleteConfirmModal';
import { RecordFiltersPanel } from '../components/records/RecordFiltersPanel';
import { RecordsHeader } from '../components/records/RecordsHeader';
import { Pagination } from '../components/records/Pagination';
import { useDebounce } from '../hooks/useDebounce';

export default function RecordsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'ADMIN';
  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilters = useMemo((): RecordFilters => {
    return {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 15,
      sort: (searchParams.get('sort') as 'date' | 'amount' | 'createdAt') || 'date',
      order: (searchParams.get('order') as 'asc' | 'desc') || 'desc',
      type: (searchParams.get('type') as TransactionType | '') || '',
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || '',
      startDate: searchParams.get('startDate') || '',
      endDate: searchParams.get('endDate') || '',
    };
  }, []);

  const [filters, setFilters] = useState<RecordFilters>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(initialFilters.search || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.page && filters.page > 1) params.page = filters.page.toString();
    if (filters.search) params.search = filters.search;
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.sort && filters.sort !== 'date') params.sort = filters.sort;
    if (filters.order && filters.order !== 'desc') params.order = filters.order;
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch || undefined, page: 1 }));
  }, [debouncedSearch]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const emptyForm: CreateRecordInput = {
    amount: 0,
    type: 'EXPENSE',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  };
  const [form, setForm] = useState<CreateRecordInput>(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ['records', filters],
    queryFn: () => recordsApi.getAll(filters),
    staleTime: 10 * 60 * 1000,
  });

  const records = data?.data || [];
  const pagination = data?.pagination;

  const createMutation = useMutation({
    mutationFn: (input: CreateRecordInput) => recordsApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Record created');
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecordInput }) =>
      recordsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Record updated');
      closeModal();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => recordsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Record deleted');
      setDeleteConfirm(null);
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Failed to delete'),
  });

  const openCreate = () => {
    setEditingRecord(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (r: FinancialRecord) => {
    setEditingRecord(r);
    setForm({
      amount: Number(r.amount),
      type: r.type,
      category: r.category,
      date: new Date(r.date).toISOString().split('T')[0],
      description: r.description || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
    setForm(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRecord) {
      updateMutation.mutate({ id: editingRecord.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-8 animate-fade-in relative pb-10">
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-10 blur-[120px] bg-rose-500" />
      </div>

      <RecordsHeader
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        isAdmin={isAdmin}
        onCreate={openCreate}
      />

      {showFilters && (
        <RecordFiltersPanel filters={filters} setFilters={setFilters} />
      )}

      <RecordTable 
        isLoading={isLoading} 
        records={records} 
        isAdmin={isAdmin} 
        onEdit={openEdit} 
        onDelete={(id) => setDeleteConfirm(id)} 
      />

      {pagination && pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {modalOpen && (
        <RecordModal
          editingRecord={editingRecord}
          form={form}
          setForm={setForm}
          isMutating={isMutating}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          isPending={deleteMutation.isPending}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => deleteMutation.mutate(deleteConfirm)}
        />
      )}
    </div>
  );
}
