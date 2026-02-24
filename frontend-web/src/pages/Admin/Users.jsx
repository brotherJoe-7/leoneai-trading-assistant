import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import styles from './Users.module.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminAPI.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data if API fails
      setUsers([
        {
          id: 1,
          username: 'admin',
          email: 'admin@leoneai.com',
          full_name: 'Admin User',
          is_active: true,
          is_superuser: true,
        },
        {
          id: 2,
          username: 'trader1',
          email: 'trader1@example.com',
          full_name: 'John Doe',
          is_active: true,
          is_superuser: false,
        },
        {
          id: 3,
          username: 'trader2',
          email: 'trader2@example.com',
          full_name: 'Jane Smith',
          is_active: false,
          is_superuser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    user =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.adminUsers}>
        <div className={styles.loading}>Loading users...</div>
      </div>
    );
  }

  return (
    <div className={styles.adminUsers}>
      <header className={styles.header}>
        <div>
          <h1>User Management</h1>
          <p className={styles.subtitle}>Manage all platform users</p>
        </div>
        <button className={styles.btnPrimary}>
          <span>+</span> Add User
        </button>
      </header>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search users by name, email, or username..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Full Name</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.avatar}>
                      {user.username?.substring(0, 2).toUpperCase()}
                    </div>
                    <span>{user.username}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.full_name}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${user.is_active ? styles.active : styles.inactive}`}
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <span
                    className={`${styles.roleBadge} ${user.is_superuser ? styles.admin : styles.user}`}
                  >
                    {user.is_superuser ? 'Admin' : 'User'}
                  </span>
                </td>
                <td>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionBtn}>Edit</button>
                    <button className={`${styles.actionBtn} ${styles.danger}`}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className={styles.emptyState}>
          <p>No users found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
