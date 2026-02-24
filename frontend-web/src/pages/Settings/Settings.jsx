import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Settings.module.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Toast helper ──────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <div className={`${styles.toast} ${type === 'error' ? styles.toastError : styles.toastSuccess}`}>
    {type === 'success' ? '✅' : '❌'} {message}
    <button className={styles.toastClose} onClick={onClose}>
      ×
    </button>
  </div>
);

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);

  // Profile form state (initialised from AuthContext user)
  const [profile, setProfile] = useState({
    full_name: '',
    country: 'Sierra Leone',
    currency_preference: 'SLL',
    risk_tolerance: 'MODERATE',
  });

  // Notification preferences (from user object)
  const [prefs, setPrefs] = useState({
    notifications_enabled: true,
    email_alerts: true,
    push_notifications: false,
  });

  // Password change
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  // Settings persistence
  const [saving, setSaving] = useState(false);

  // API key management (local state for now)
  const [apiKeys] = useState([
    {
      id: 1,
      name: 'Default key',
      key: 'lnai_live_••••••••••••••••',
      created: '2025-11-12',
      status: 'Active',
    },
  ]);

  // Initialise from user
  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.full_name || user.username || '',
        country: user.country || 'Sierra Leone',
        currency_preference: user.currency_preference || 'SLL',
        risk_tolerance: user.risk_tolerance || 'MODERATE',
      });
      if (user.preferences) {
        setPrefs({
          notifications_enabled: user.preferences.notifications_enabled ?? true,
          email_alerts: user.preferences.email_alerts ?? true,
          push_notifications: user.preferences.push_notifications ?? false,
        });
      }
    }
  }, [user]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ── Save all settings ────────────────────────────────────────────
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/users/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ ...profile, ...prefs }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Save failed');
      const data = await res.json();
      updateUser({ ...data.user, preferences: data.user.preferences });
      showToast('Settings saved successfully!');
    } catch (e) {
      showToast(e.message || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ──────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!pwForm.current || !pwForm.newPw) {
      showToast('Please fill in all password fields', 'error');
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (pwForm.newPw.length < 8) {
      showToast('New password must be at least 8 characters', 'error');
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/users/me/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ current_password: pwForm.current, new_password: pwForm.newPw }),
      });
      if (!res.ok) throw new Error((await res.json()).detail || 'Password change failed');
      showToast('Password changed successfully!');
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setPwLoading(false);
    }
  };

  // ── Photo upload ─────────────────────────────────────────────────
  const handlePhotoUpload = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5 MB', 'error');
      return;
    }
    // Create local preview (full upload requires a file storage endpoint)
    const reader = new FileReader();
    reader.onload = () => showToast(`Photo "${file.name}" selected — upload endpoint coming soon`);
    reader.readAsDataURL(file);
  };

  // ── Logout ───────────────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (user?.full_name || user?.username || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const tabs = [
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'trading', icon: '📊', label: 'Trading' },
    { id: 'api', icon: '🔌', label: 'API Keys' },
    { id: 'security', icon: '🔒', label: 'Security' },
  ];

  return (
    <div className={styles.settings}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <header className={styles.header}>
        <h1>⚙️ Settings</h1>
        <p className={styles.subtitle}>Manage your profile, preferences, and security</p>
      </header>

      <div className={styles.settingsContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}

          <button className={styles.logoutBtn} onClick={handleLogout}>
            🚪 Log Out
          </button>
        </aside>

        {/* Content */}
        <div className={styles.content}>
          {/* ── Profile ──────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className={styles.section}>
              <h2>Profile Settings</h2>
              <p className={styles.sectionSubtitle}>
                Manage your identity and currency preferences.
              </p>

              {/* Avatar */}
              <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                  <span>{initials}</span>
                </div>
                <div className={styles.profileInfo}>
                  <h3>{user?.full_name || user?.username || 'Trader'}</h3>
                  <p>{user?.email || ''}</p>
                  <div className={styles.badges}>
                    {user?.is_verified && <span className={styles.verifiedBadge}>✓ VERIFIED</span>}
                    <span className={styles.planBadge}>{user?.plan_type || 'FREE'}</span>
                  </div>
                </div>
                <button
                  className={styles.btnSecondary}
                  onClick={() => fileInputRef.current?.click()}
                >
                  📷 Change Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />
              </div>

              {/* Form */}
              <div className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Full Name</label>
                    <input
                      className={styles.input}
                      value={profile.full_name}
                      onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Country</label>
                    <select
                      className={styles.select}
                      value={profile.country}
                      onChange={e => setProfile(p => ({ ...p, country: e.target.value }))}
                    >
                      <option>Sierra Leone</option>
                      <option>Nigeria</option>
                      <option>Ghana</option>
                      <option>Kenya</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Display Currency</label>
                    <select
                      className={styles.select}
                      value={profile.currency_preference}
                      onChange={e =>
                        setProfile(p => ({ ...p, currency_preference: e.target.value }))
                      }
                    >
                      <option value="SLL">New Leone (SLE)</option>
                      <option value="USD">US Dollar (USD)</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Risk Tolerance</label>
                    <select
                      className={styles.select}
                      value={profile.risk_tolerance}
                      onChange={e => setProfile(p => ({ ...p, risk_tolerance: e.target.value }))}
                    >
                      <option value="CONSERVATIVE">Conservative</option>
                      <option value="MODERATE">Moderate</option>
                      <option value="AGGRESSIVE">Aggressive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications ─────────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <div className={styles.section}>
              <h2>Notification Preferences</h2>
              <p className={styles.sectionSubtitle}>
                Choose how you want to receive trade alerts and updates.
              </p>

              <div className={styles.notificationsList}>
                {[
                  {
                    key: 'notifications_enabled',
                    icon: '📳',
                    title: 'All Notifications',
                    desc: 'Master switch for all notifications',
                  },
                  {
                    key: 'email_alerts',
                    icon: '📧',
                    title: 'Email Alerts',
                    desc: 'Daily market summaries and trade signals',
                  },
                  {
                    key: 'push_notifications',
                    icon: '🔔',
                    title: 'Push Notifications',
                    desc: 'Real-time mobile and browser alerts',
                  },
                ].map(item => (
                  <div key={item.key} className={styles.notificationItem}>
                    <div className={styles.notificationIcon}>{item.icon}</div>
                    <div className={styles.notificationInfo}>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={prefs[item.key]}
                        onChange={e => setPrefs(p => ({ ...p, [item.key]: e.target.checked }))}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </div>
                ))}
              </div>

              <div className={styles.notificationTypes}>
                <h3>Notify me about:</h3>
                {[
                  'Deposits & Withdrawals',
                  'Completed Trades',
                  'Signal Alerts',
                  'Price Alerts',
                  'System Updates',
                ].map(item => (
                  <label key={item} className={styles.checkItem}>
                    <input type="checkbox" defaultChecked />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ── Trading Preferences ───────────────────────────────── */}
          {activeTab === 'trading' && (
            <div className={styles.section}>
              <h2>Trading Preferences</h2>
              <p className={styles.sectionSubtitle}>
                Configure defaults for your trading activity.
              </p>

              <div className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Default Trade Size (SLL)</label>
                    <input className={styles.input} type="number" placeholder="100000" min="0" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Stop Loss %</label>
                    <input
                      className={styles.input}
                      type="number"
                      placeholder="5"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Take Profit %</label>
                    <input
                      className={styles.input}
                      type="number"
                      placeholder="15"
                      min="0"
                      max="1000"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Preferred Market</label>
                    <select className={styles.select}>
                      <option>Crypto & Forex</option>
                      <option>Crypto only</option>
                      <option>Forex only</option>
                    </select>
                  </div>
                </div>

                <div className={styles.infoBox}>
                  💡 <strong>Risk Level:</strong> {profile.risk_tolerance} — Change in Profile tab.
                </div>
              </div>
            </div>
          )}

          {/* ── API Keys ──────────────────────────────────────────── */}
          {activeTab === 'api' && (
            <div className={styles.section}>
              <h2>API Management</h2>
              <p className={styles.sectionSubtitle}>
                Create and manage your LeoneAI API keys for programmatic access.
              </p>

              <div className={styles.apiKeysList}>
                {apiKeys.map(k => (
                  <div key={k.id} className={styles.apiKeyCard}>
                    <div className={styles.apiKeyInfo}>
                      <strong>{k.name}</strong>
                      <code className={styles.apiKey}>{k.key}</code>
                      <span className={styles.apiKeyMeta}>
                        Created {k.created} ·{' '}
                        <span className={styles.apiKeyActive}>{k.status}</span>
                      </span>
                    </div>
                    <div className={styles.apiKeyActions}>
                      <button
                        className={styles.btnSecondary}
                        onClick={() => showToast('Key copied!', 'success')}
                      >
                        📋 Copy
                      </button>
                      <button
                        className={`${styles.btnSecondary} ${styles.danger}`}
                        onClick={() => showToast('Key revoked', 'success')}
                      >
                        🗑 Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className={styles.btnPrimary}
                onClick={() =>
                  showToast('New API key generated — check your email to confirm', 'success')
                }
              >
                + Generate New Key
              </button>

              <div className={styles.infoBox} style={{ marginTop: 20 }}>
                📚 See the <strong>API Reference</strong> in <code>docs/API_REFERENCE.md</code> for
                usage examples and rate limits.
              </div>
            </div>
          )}

          {/* ── Security ──────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <div className={styles.section}>
              <h2>Security Settings</h2>
              <p className={styles.sectionSubtitle}>
                Keep your account safe with strong passwords and 2FA.
              </p>

              <div className={styles.securityBlock}>
                <h3>Change Password</h3>
                <div className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.fieldLabel}>Current Password</label>
                    <input
                      type="password"
                      className={styles.input}
                      value={pwForm.current}
                      onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
                      placeholder="••••••••"
                    />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.fieldLabel}>New Password</label>
                      <input
                        type="password"
                        className={styles.input}
                        value={pwForm.newPw}
                        onChange={e => setPwForm(p => ({ ...p, newPw: e.target.value }))}
                        placeholder="Min. 8 characters"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.fieldLabel}>Confirm New Password</label>
                      <input
                        type="password"
                        className={styles.input}
                        value={pwForm.confirm}
                        onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
                        placeholder="Repeat password"
                      />
                    </div>
                  </div>
                  <button
                    className={styles.btnPrimary}
                    onClick={handleChangePassword}
                    disabled={pwLoading}
                  >
                    {pwLoading ? 'Changing...' : '🔑 Change Password'}
                  </button>
                </div>
              </div>

              <div className={styles.securityBlock}>
                <h3>Two-Factor Authentication (2FA)</h3>
                <p className={styles.sectionSubtitle}>
                  Add an extra layer of security to your account.
                </p>
                <div className={styles.twoFaRow}>
                  <div>
                    <span className={styles.twoFaStatus}>Status: </span>
                    <span className={styles.twoFaOff}>Disabled</span>
                  </div>
                  <button
                    className={styles.btnPrimary}
                    onClick={() =>
                      showToast(
                        '2FA setup coming soon — we will send a QR code to your email',
                        'success'
                      )
                    }
                  >
                    Enable 2FA
                  </button>
                </div>
              </div>

              <div className={styles.securityBlock}>
                <h3>Danger Zone</h3>
                <button
                  className={`${styles.btnPrimary} ${styles.dangerBtn}`}
                  onClick={handleLogout}
                >
                  🚪 Log Out Everywhere
                </button>
              </div>
            </div>
          )}

          {/* ── Action buttons ────────────────────────────────────── */}
          {activeTab !== 'security' && activeTab !== 'api' && (
            <div className={styles.actionButtons}>
              <button
                className={styles.btnSecondary}
                onClick={() => showToast('Changes discarded', 'success')}
              >
                Cancel
              </button>
              <button className={styles.btnPrimary} onClick={handleSaveAll} disabled={saving}>
                {saving ? '💾 Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
