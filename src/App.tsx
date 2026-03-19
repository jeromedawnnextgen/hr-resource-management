import { useState } from 'react';
import { UserForm } from './components/UserForm';
import { UserList } from './components/UserList';
import { deleteUser, getUsers, setUserStatus } from './data/mockUsers';
import type { MockUser } from './data/mockUsers';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const refresh = () => {
    setRefreshKey((k) => k + 1);
    setSelectedUser(null);
  };

  const handleRowSelect = (user: MockUser) => setSelectedUser(user);

  const handleUserCreated = () => {
    refresh();
    setIsCreating(false);
  };

  const handleUserUpdated = () => {
    setRefreshKey((k) => k + 1);
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    const confirmed = window.confirm(
      `Delete "${selectedUser.name}" (${selectedUser.employeeId})? This cannot be undone.`,
    );
    if (!confirmed) return;
    await deleteUser(selectedUser.id);
    refresh();
  };

  const handleSetStatus = async (status: 'Active' | 'Inactive') => {
    if (!selectedUser) return;
    await setUserStatus(selectedUser.id, status);
    setRefreshKey((k) => k + 1);
    setSelectedUser((u) => (u ? { ...u, status } : null));
  };

  const handleExport = async () => {
    const users = await getUsers();
    const header = ['User Name', 'Email', 'Employee ID', 'Department', 'User ID', 'Status'];
    const rows = users.map((u) =>
      [u.name, u.email, u.employeeId, u.department, u.id, u.status]
        .map((v) => `"${v}"`)
        .join(','),
    );
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo" aria-hidden="true">
            🔷
          </span>
          <div>
            <h1>HR Resource Management</h1>
            <p>Model-driven style dashboard</p>
          </div>
        </div>
      </header>

      <div className="app-body">
        <aside className="app-nav">
          <div className="nav-section">
            <h2 className="nav-section-title">Entities</h2>
            <button
              className={`nav-item ${!selectedUser ? 'active' : ''}`}
              onClick={() => setSelectedUser(null)}
            >
              Users
            </button>
          </div>
        </aside>

        <main className="app-main">
          <div className="page-header">
            <div>
              <h2 className="page-title">Users</h2>
              <p className="page-subtitle">
                Browse and manage user records in a model-driven style experience.
              </p>
            </div>
          </div>

          <div className="command-bar-ribbon">
            <div className="ribbon-group">
              <button type="button" className="ribbon-btn primary" onClick={() => { setIsCreating(true); setSelectedUser(null); }}>
                <svg className="ribbon-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                New
              </button>
              <button type="button" className="ribbon-btn" disabled={!selectedUser} onClick={() => setIsEditing(true)}>
                <svg className="ribbon-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 2L14 5L6 13H3V10L11 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                Edit
              </button>
              <button type="button" className="ribbon-btn danger" disabled={!selectedUser} onClick={handleDelete}>
                <svg className="ribbon-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4h10M6 4V2h4v2M5 4v9a1 1 0 001 1h4a1 1 0 001-1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Delete
              </button>
            </div>

            <div className="ribbon-divider" />

            <div className="ribbon-group">
              <button
                type="button"
                className="ribbon-btn"
                disabled={!selectedUser || selectedUser.status === 'Active'}
                onClick={() => handleSetStatus('Active')}
              >
                <svg className="ribbon-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 8l1.5 1.5L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Activate
              </button>
              <button
                type="button"
                className="ribbon-btn"
                disabled={!selectedUser || selectedUser.status === 'Inactive'}
                onClick={() => handleSetStatus('Inactive')}
              >
                <svg className="ribbon-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 8h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Deactivate
              </button>
            </div>

            <div className="ribbon-divider" />

            <div className="ribbon-group">
              <button type="button" className="ribbon-btn" onClick={handleExport}>
                <svg className="ribbon-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 10v3H3v-3M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Export
              </button>
              <button type="button" className="ribbon-btn" onClick={refresh}>
                <svg className="ribbon-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 8A5.5 5.5 0 112.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M2.5 2v3.5H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Refresh
              </button>
            </div>
          </div>

          <div className="content-grid">
            <div className="content-main">
              <UserList
                refreshKey={refreshKey}
                selectedUserId={selectedUser?.id}
                onSelectUser={handleRowSelect}
              />
            </div>
          </div>
        </main>
      </div>

      {(isCreating || isEditing) && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            {isCreating && (
              <UserForm
                onUserCreated={handleUserCreated}
                onCancel={() => setIsCreating(false)}
              />
            )}
            {isEditing && selectedUser && (
              <UserForm
                initialUser={selectedUser}
                onUserUpdated={handleUserUpdated}
                onCancel={() => setIsEditing(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
