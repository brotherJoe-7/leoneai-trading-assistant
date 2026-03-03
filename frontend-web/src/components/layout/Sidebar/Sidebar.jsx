import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const { user, logout, isSuperuser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    const handler = e => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        const toggle = document.getElementById('hamburger-btn');
        if (!toggle?.contains(e.target)) setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/markets', icon: '📈', label: 'Markets' },
    { path: '/trading', icon: '🚀', label: 'Pro Trading' },
    { path: '/signals', icon: '⚡', label: 'Signals' },
    { path: '/portfolio', icon: '💼', label: 'Portfolio' },
    { path: '/learn', icon: '📚', label: 'Learn' },
  ];

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : (user?.username || 'U').slice(0, 2).toUpperCase();

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        id="hamburger-btn"
        className={styles.hamburger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className={`${styles.hbar} ${isOpen ? styles.hbarOpen1 : ''}`} />
        <span className={`${styles.hbar} ${isOpen ? styles.hbarOpen2 : ''}`} />
        <span className={`${styles.hbar} ${isOpen ? styles.hbarOpen3 : ''}`} />
      </button>

      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}

      <aside ref={sidebarRef} className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🇸🇱</div>
          <div>
            <div className={styles.logoText}>LeoneAI</div>
            <div className={styles.logoSubtext}>Sierra Leone's AI Trader</div>
          </div>
          {/* Close button inside sidebar on mobile */}
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close">
            ✕
          </button>
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
            <span>{initials}</span>
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.full_name || user?.username || 'User'}</p>
            <div className={styles.statusBadge}>
              <span className={styles.statusDot} />
              <span>{isSuperuser ? 'Admin' : 'Verified Trader'}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
