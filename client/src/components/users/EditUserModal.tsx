import type { Role, Status } from '../../types';
import { BaseModal, Button, Select } from '../ui';

interface EditUserModalProps {
  isOpen: boolean;
  user: { id: string; role: Role; status: Status; name: string } | null;
  isPending: boolean;
  onClose: () => void;
  onSave: (id: string, role: Role, status: Status) => void;
}

export function EditUserModal({ isOpen, user, isPending, onClose, onSave }: EditUserModalProps) {
  if (!user) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Access"
      size="sm"
      accentColor="violet"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            isLoading={isPending}
            onClick={() => onSave(user.id, user.role, user.status)}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="text-sm text-surface-500 dark:text-slate-400">
          Editing access for <span className="font-semibold text-surface-900 dark:text-white">{user.name}</span>
        </p>
        
        <div>
          <label className="block text-sm font-semibold text-surface-700 dark:text-slate-300 mb-2">
            Role
          </label>
          <Select
            value={user.role}
            onChange={(e) => onSave(user.id, e.target.value as Role, user.status)}
            options={[
              { value: 'VIEWER', label: 'Viewer' },
              { value: 'ANALYST', label: 'Analyst' },
              { value: 'ADMIN', label: 'Admin' },
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-surface-700 dark:text-slate-300 mb-2">
            Status
          </label>
          <Select
            value={user.status}
            onChange={(e) => onSave(user.id, user.role, e.target.value as Status)}
            options={[
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
            ]}
          />
        </div>
      </div>
    </BaseModal>
  );
}
