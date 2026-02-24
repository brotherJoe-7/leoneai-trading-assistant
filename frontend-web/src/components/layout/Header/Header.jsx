import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './Header.module.css';
import Button from '../../common/Button/Button';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Display user's name: prefer full_name, fallback to email prefix
  const displayName = user?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🇸🇱</span>
            <span className={styles.logoText}>LeoneAI</span>
          </Link>

          <nav className={styles.nav}>
            <Link to="/dashboard" className={styles.navLink}>
              Dashboard
            </Link>
            <Link to="/signals" className={styles.navLink}>
              Signals
            </Link>
            <Link to="/portfolio" className={styles.navLink}>
              Portfolio
            </Link>
            <Link to="/markets" className={styles.navLink}>
              Markets
            </Link>
            <Link to="/learn" className={styles.navLink}>
              Learn
            </Link>
          </nav>
        </div>

        <div className={styles.userSection}>
          {isAuthenticated && user ? (
            <>
              <div className={styles.userInfo}>
                {user.plan_type && user.plan_type !== 'FREE' && (
                  <span className={styles.planBadge}>{user.plan_type}</span>
                )}
                <div className={styles.userName}>{displayName}</div>
              </div>

              <div className={styles.actions}>
                <Button variant="secondary" size="small" onClick={() => navigate('/subscription')}>
                  Plans
                </Button>
                <Button variant="outline" size="small" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className={styles.authButtons}>
              <Button variant="secondary" size="small" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="primary" size="small" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
