import { Loader2 } from 'lucide-react';
import { BaseModal, Button, Input, Textarea, Select } from '../ui';
import { CATEGORIES } from '../ui/constants';
import type { CreateRecordInput, FinancialRecord, TransactionType } from '../../types';

interface RecordModalProps {
  editingRecord: FinancialRecord | null;
  form: CreateRecordInput;
  setForm: React.Dispatch<React.SetStateAction<CreateRecordInput>>;
  isMutating: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RecordModal({
  editingRecord,
  form,
  setForm,
  isMutating,
  onClose,
  onSubmit,
}: RecordModalProps) {
  const categoryOptions = CATEGORIES.ALL.map(c => ({ value: c, label: c }));

  return (
    <BaseModal
      isOpen={true}
      onClose={onClose}
      title={editingRecord ? 'Edit Entry' : 'New Transaction'}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isMutating}
            onClick={(e: any) => onSubmit(e)}
          >
            {editingRecord ? 'Save Changes' : 'Confirm'}
          </Button>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-surface-700 dark:text-slate-300 mb-2">
              Transaction Type
            </label>
            <Select
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as TransactionType }))}
              options={[
                { value: 'EXPENSE', label: 'Expense' },
                { value: 'INCOME', label: 'Income' },
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-surface-700 dark:text-slate-300 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.amount || ''}
              onChange={(e) => setForm((p) => ({ ...p, amount: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-surface-700 dark:text-white font-display font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-surface-700 dark:text-slate-300 mb-2">
            Category
          </label>
          <Select
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            options={categoryOptions}
            placeholder="Select category"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-surface-700 dark:text-slate-300 mb-2">
            Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            className="w-full bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-surface-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-surface-700 dark:text-slate-300 mb-2">
            Note <span className="text-surface-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="w-full bg-surface-50 dark:bg-slate-800 border border-surface-200 dark:border-white/10 rounded-xl px-4 py-3 text-surface-700 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all font-medium min-h-[100px] resize-none"
            placeholder="What was this for?"
            maxLength={500}
          />
        </div>
      </form>
    </BaseModal>
  );
}
