import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import styles from './Dashboard.module.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await adminAPI.getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Error fetching admin dashboard:', error);
      // Use mock data if API fails
      setStats({
        total_users: 1247,
        active_users: 892,
        total_trades: 5634,
        total_volume: 125000000,
        pending_verifications: 23,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.adminDashboard}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.adminDashboard}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p className={styles.subtitle}>System overview and management</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div>
            <h3>Total Users</h3>
            <p className={styles.statValue}>{stats?.total_users || 0}</p>
            <span className={styles.statChange}>+{stats?.active_users || 0} active</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💹</div>
          <div>
            <h3>Total Trades</h3>
            <p className={styles.statValue}>{stats?.total_trades || 0}</p>
            <span className={styles.statChange}>All time</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div>
            <h3>Total Volume</h3>
            <p className={styles.statValue}>Le {stats?.total_volume?.toLocaleString() || 0}</p>
            <span className={styles.statChange}>Trading volume</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div>
            <h3>Pending</h3>
            <p className={styles.statValue}>{stats?.pending_verifications || 0}</p>
            <span className={styles.statChange}>Verifications</span>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <a href="/admin/users" className={styles.actionCard}>
            <span className={styles.actionIcon}>👥</span>
            <h3>Manage Users</h3>
            <p>View and manage all users</p>
          </a>
          <a href="/admin/trades" className={styles.actionCard}>
            <span className={styles.actionIcon}>📊</span>
            <h3>View Trades</h3>
            <p>Monitor all trading activity</p>
          </a>
          <div className={styles.actionCard}>
            <span className={styles.actionIcon}>⚙️</span>
            <h3>System Settings</h3>
            <p>Configure platform settings</p>
          </div>
          <div className={styles.actionCard}>
            <span className={styles.actionIcon}>📈</span>
            <h3>Analytics</h3>
            <p>View detailed reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
