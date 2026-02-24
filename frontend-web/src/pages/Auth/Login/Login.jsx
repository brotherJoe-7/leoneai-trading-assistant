import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    alert('Google Sign-In coming soon! For now, please use email/password login.');
  };

  const handleAppleSignIn = () => {
    alert('Apple Sign-In coming soon! For now, please use email/password login.');
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🇸🇱</div>
            <h1>LeoneAI</h1>
            <p>Sierra Leone's AI Trader</p>
          </div>

          <h2>Welcome Back</h2>
          <p className={styles.subtitle}>Sign in to access your trading dashboard</p>

          {error && (
            <div className={styles.error}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} autoComplete="off">
            <div className={styles.formGroup}>
              <label htmlFor="username">Username or Email</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                className={styles.input}
                autoComplete="off"
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className={styles.input}
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkbox}>
                <input type="checkbox" disabled={loading} />
                <span>Remember me</span>
              </label>
              <a href="#" className={styles.forgotPassword}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span>OR CONTINUE WITH</span>
          </div>

          <div className={styles.socialLogin}>
            <button
              className={styles.socialBtn}
              onClick={handleGoogleSignIn}
              disabled={loading}
              title="Sign in with Google"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" className={styles.socialIcon}>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button
              className={styles.socialBtn}
              onClick={handleAppleSignIn}
              disabled={loading}
              title="Sign in with Apple"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" className={styles.socialIcon}>
                <path
                  fill="currentColor"
                  d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className={styles.divider}></div>

          <p className={styles.signupLink}>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>

        <div className={styles.features}>
          <h3>Why LeoneAI?</h3>
          <div className={styles.featureList}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🤖</span>
              <div>
                <h4>AI-Powered Signals</h4>
                <p>Get real-time trading signals powered by advanced AI</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>💰</span>
              <div>
                <h4>SLL Trading</h4>
                <p>Trade directly with Sierra Leone Leone currency</p>
              </div>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📱</span>
              <div>
                <h4>Mobile Money</h4>
                <p>Deposit and withdraw via Orange Money, Afrimoney</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
