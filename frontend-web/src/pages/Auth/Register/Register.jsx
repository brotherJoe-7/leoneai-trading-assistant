import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './Register.module.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    confirmPassword: '',
    country: 'Sierra Leone',
    currency_preference: 'SLL',
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🇸🇱</div>
            <h1>LeoneAI</h1>
            <p>Sierra Leone's AI Trader</p>
          </div>

          <h2>Create Account</h2>
          <p className={styles.subtitle}>Join thousands of Sierra Leonean traders</p>

          {error && (
            <div className={styles.error}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="full_name">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="Sierra Leone">Sierra Leone</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="currency_preference">Currency</label>
                <select
                  id="currency_preference"
                  name="currency_preference"
                  value={formData.currency_preference}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="SLL">SLL (Sierra Leone Leone)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="EUR">EUR (Euro)</option>
                </select>
              </div>
            </div>

            <div className={styles.terms}>
              <label className={styles.checkbox}>
                <input type="checkbox" required />
                <span>I agree to the Terms of Service and Privacy Policy</span>
              </label>
            </div>

            <button type="submit" className={styles.btnPrimary} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className={styles.loginLink}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>

        <div className={styles.benefits}>
          <h3>Start Trading Today</h3>
          <div className={styles.benefitList}>
            <div className={styles.benefit}>
              <span className={styles.checkIcon}>✓</span>
              <div>
                <h4>Free Account</h4>
                <p>No hidden fees or subscription costs</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <span className={styles.checkIcon}>✓</span>
              <div>
                <h4>AI-Powered Insights</h4>
                <p>Get real-time trading signals from our AI</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <span className={styles.checkIcon}>✓</span>
              <div>
                <h4>Local Payment Methods</h4>
                <p>Orange Money, Afrimoney, and more</p>
              </div>
            </div>
            <div className={styles.benefit}>
              <span className={styles.checkIcon}>✓</span>
              <div>
                <h4>Educational Resources</h4>
                <p>Learn trading with Sierra Leone-focused content</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
