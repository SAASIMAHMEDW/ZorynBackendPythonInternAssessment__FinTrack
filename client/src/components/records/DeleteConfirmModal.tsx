import { ConfirmModal } from '../ui';

interface DeleteConfirmModalProps {
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ isPending, onCancel, onConfirm }: DeleteConfirmModalProps) {
  return (
    <ConfirmModal
      isOpen={true}
      onClose={onCancel}
      onConfirm={onConfirm}
      title="Delete Transaction"
      message="Are you sure you want to permanently delete this record? This action cannot be undone."
      confirmText="Delete"
      isPending={isPending}
      variant="danger"
    />
  );
}
