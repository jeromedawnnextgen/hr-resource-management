import { useEffect, useState } from 'react';
import { getUsers } from '../data/mockUsers';
import type { MockUser } from '../data/mockUsers';

interface UserListProps {
  refreshKey: number;
  selectedUserId?: string;
  onSelectUser?: (user: MockUser) => void;
}

export function UserList({ refreshKey, selectedUserId, onSelectUser }: UserListProps) {
  const [users, setUsers] = useState<MockUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const items = await getUsers();
      setUsers(items);
    } catch (err) {
      setError('An unexpected error occurred while loading users.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="list-card">
      <div className="list-header">
        <h2>Users</h2>
        <button onClick={fetchUsers} disabled={loading} className="refresh-btn">
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && <p className="message error">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p className="empty-state">No users found. Create one using the "New" button.</p>
      )}

      {users.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>User ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelected = user.id === selectedUserId;

                return (
                  <tr
                    key={user.id}
                    className={isSelected ? 'selected-row' : ''}
                    onClick={() => onSelectUser?.(user)}
                    tabIndex={0}
                  >
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.employeeId}</td>
                    <td>{user.department}</td>
                    <td className="id-cell">{user.id}</td>
                    <td>
                      <span className={`status-badge ${user.status === 'Active' ? 'active' : 'inactive'}`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
