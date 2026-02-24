import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { user, logout, isSuperuser } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/markets', icon: '📈', label: 'Markets' },
    { path: '/trading', icon: '🚀', label: 'Pro Trading' },
    { path: '/signals', icon: '⚡', label: 'Signals' },
    { path: '/portfolio', icon: '💼', label: 'Portfolio' },
    { path: '/learn', icon: '📚', label: 'Learn' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>🇸🇱</div>
        <div className={styles.logoText}>LeoneAI</div>
        <div className={styles.logoSubtext}>Sierra Leone's AI Trader</div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <p className={styles.navSectionTitle}>MAIN MENU</p>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className={styles.navSection}>
          <p className={styles.navSectionTitle}>ACCOUNT</p>
          <NavLink
            to="/settings"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>⚙️</span>
            <span className={styles.navLabel}>Settings</span>
          </NavLink>

          {isSuperuser && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>👑</span>
              <span className={styles.navLabel}>Admin</span>
            </NavLink>
          )}

          <button onClick={logout} className={styles.navItem}>
            <span className={styles.navIcon}>🚪</span>
            <span className={styles.navLabel}>Logout</span>
          </button>
        </div>
      </nav>

      <div className={styles.premiumCard}>
        <h4>{user?.plan_type || 'FREE'} PLAN</h4>
        <p>Get advanced AI signals and expert analysis</p>
        <button className={styles.upgradeBtn} onClick={() => navigate('/subscription')}>
          {user?.plan_type === 'FREE' ? 'UPGRADE' : 'MANAGE'}
        </button>
      </div>

      <div className={styles.userSection}>
        <div className={styles.avatar}>
          <span>JN</span>
        </div>
        <div className={styles.userInfo}>
          <p className={styles.userName}>
            {user?.username === 'admin' ? 'Joseph Nimneh' : user?.username || 'User'}
          </p>
          <div className={styles.statusBadge}>
            <span className={styles.statusDot}></span>
            <span>{isSuperuser ? 'Admin' : 'Verified Trader'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
