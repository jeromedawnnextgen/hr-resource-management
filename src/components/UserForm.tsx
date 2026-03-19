import { useState } from 'react';
import { createUser, updateUser } from '../data/mockUsers';
import type { MockUser } from '../data/mockUsers';

interface UserFormProps {
  initialUser?: MockUser;
  onUserCreated?: () => void;
  onUserUpdated?: () => void;
  onCancel?: () => void;
}

export function UserForm({ initialUser, onUserCreated, onUserUpdated, onCancel }: UserFormProps) {
  const isEditing = !!initialUser;

  const [userName, setUserName] = useState(initialUser?.name ?? '');
  const [email, setEmail] = useState(initialUser?.email ?? '');
  const [employeeId, setEmployeeId] = useState(initialUser?.employeeId ?? '');
  const [department, setDepartment] = useState(initialUser?.department ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = userName.trim();
    const trimmedEmail = email.trim();
    const trimmedEmployeeId = employeeId.trim();
    const trimmedDepartment = department.trim();

    if (!trimmedName || !trimmedEmail || !trimmedEmployeeId || !trimmedDepartment) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await updateUser(initialUser.id, {
          name: trimmedName,
          email: trimmedEmail,
          employeeId: trimmedEmployeeId,
          department: trimmedDepartment,
        });
        onUserUpdated?.();
      } else {
        await createUser({
          name: trimmedName,
          email: trimmedEmail,
          employeeId: trimmedEmployeeId,
          department: trimmedDepartment,
        });
        onUserCreated?.();
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>{isEditing ? `Edit User — ${initialUser.name}` : 'Create New User'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userName">User Name</label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter user name"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="employeeId">Employee ID</label>
          <input
            id="employeeId"
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="EMP-0001"
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input
            id="department"
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Engineering"
            disabled={loading}
            required
          />
        </div>

        {error && <p className="message error">{error}</p>}

        <div className="button-group">
          <button
            type="submit"
            disabled={
              loading ||
              !userName.trim() ||
              !email.trim() ||
              !employeeId.trim() ||
              !department.trim()
            }
          >
            {loading ? (isEditing ? 'Saving...' : 'Creating...') : isEditing ? 'Save Changes' : 'Create User'}
          </button>
          <button type="button" className="secondary-btn" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
