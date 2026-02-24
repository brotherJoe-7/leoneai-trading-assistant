import React, { useState, useEffect } from 'react';
import styles from './Settings.module.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [currency, setCurrency] = useState(true);
  const [krio, setKrio] = useState(false); // Krio translation state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  // Load settings on mount
  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('leone_settings'));
    if (savedSettings) {
      setCurrency(savedSettings.currency);
      setKrio(savedSettings.krio || false);
      setEmailAlerts(savedSettings.emailAlerts);
      setSmsNotifications(savedSettings.smsNotifications);
      setPushNotifications(savedSettings.pushNotifications);
    }
  }, []);

  const handleSave = () => {
    const settings = {
      currency,
      krio,
      emailAlerts,
      smsNotifications,
      pushNotifications,
    };
    localStorage.setItem('leone_settings', JSON.stringify(settings));
    alert(krio ? '✅ All tin don save!' : '✅ Settings Saved Successfully!');
  };

  const handlePhotoUpload = () => {
    // Simulate file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
      const file = e.target.files[0];
      if (file)
        alert(
          krio ? `Picha ${file.name} don upload!` : `Image ${file.name} uploaded successfully!`
        );
    };
    input.click();
  };

  const handleChangePassword = () => {
    const newPass = prompt(krio ? 'Enta u new password:' : 'Enter new password:');
    if (newPass) alert(krio ? 'Password don change!' : 'Password changed successfully!');
  };

  // Translation dictionary
  const t = (en, kr) => (krio ? kr : en);

  const tabs = [
    { id: 'profile', icon: '👤', label: t('Profile', 'Profail') },
    { id: 'notifications', icon: '🔔', label: t('Notifications', 'Notifikayshon') },
    { id: 'trading', icon: '📊', label: t('Trading', 'Tradin') },
    { id: 'api', icon: '🔌', label: 'API Management' },
    { id: 'security', icon: '🔒', label: t('Security', 'Sekyuniti') },
  ];

  return (
    <div className={styles.settings}>
      <header className={styles.header}>
        <h1>{t('Settings', 'Setin Dem')}</h1>
      </header>

      <div className={styles.settingsContainer}>
        {/* Sidebar Tabs */}
        <aside className={styles.sidebar}>
          <h3>{t('Settings', 'Setin Dem')}</h3>
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
        </aside>

        {/* Content Area */}
        <div className={styles.content}>
          {activeTab === 'profile' && (
            <div className={styles.section}>
              <h2>{t('Profile Settings', 'Profail Setin')}</h2>
              <p className={styles.sectionSubtitle}>
                {t(
                  'Manage your identity, currency preferences, and localization on LeoneAI.',
                  'Manage u identiti, moni, en wey u de na LeoneAI.'
                )}
              </p>

              <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                  <span>JN</span>
                </div>
                <div className={styles.profileInfo}>
                  <h3>Joseph Nimneh</h3>
                  <p>jnimneh20@gmail.com</p>
                  <div className={styles.verifiedBadge}>
                    <span>✓</span> {t('VERIFIED TRADER', 'VERIFAID TRADA')}
                    <span className={styles.joinDate}>{t('Joined Nov 2023', 'Join Nov 2023')}</span>
                  </div>
                </div>
                <button className={styles.btnPrimary} onClick={handlePhotoUpload}>
                  {t('Change Photo', 'Chenj Picha')}
                </button>
              </div>

              <div className={styles.preferencesSection}>
                <h3>{t('Sierra Leone Preferences', 'Salone Prefrens')}</h3>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h4>{t('Currency: New Leone (SLE)', 'Moni: Nyu Leone (SLE)')}</h4>
                    <p>
                      {t('Display all values in local currency', 'Show all moni na Salone Leone')}
                    </p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={currency}
                      onChange={e => setCurrency(e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h4>{t('Krio Interface', 'Krio Intafes')}</h4>
                    <p>{t('Translate AI insights to Krio', 'Translate AI tok to Krio')}</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={krio}
                      onChange={e => setKrio(e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className={styles.section}>
              <h2>{t('Notification Channels', 'Notifikayshon Chanel')}</h2>
              <p className={styles.sectionSubtitle}>
                {t('Choose how you want to receive updates', 'Chuz how u want get update')}
              </p>

              <div className={styles.notificationsList}>
                <div className={styles.notificationItem}>
                  <div className={styles.notificationIcon}>📧</div>
                  <div className={styles.notificationInfo}>
                    <h4>{t('Email Alerts', 'Email Alert')}</h4>
                    <p>
                      {t(
                        'Daily market summaries & trade signals',
                        'Evri day market tori & trade signal'
                      )}
                    </p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={e => setEmailAlerts(e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.notificationItem}>
                  <div className={styles.notificationIcon}>💬</div>
                  <div className={styles.notificationInfo}>
                    <h4>{t('SMS Notifications', 'SMS Update')}</h4>
                    <p>{t('Critical price alerts (Carrier rates apply)', 'Importan pris alert')}</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={smsNotifications}
                      onChange={e => setSmsNotifications(e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.notificationItem}>
                  <div className={styles.notificationIcon}>🔔</div>
                  <div className={styles.notificationInfo}>
                    <h4>{t('Push Notifications', 'Fone Notifikayshon')}</h4>
                    <p>{t('Real-time mobile app updates', 'Sharp sharp app update')}</p>
                  </div>
                  <label className={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={e => setPushNotifications(e.target.checked)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trading' && (
            <div className={styles.section}>
              <h2>{t('Trading Preferences', 'Tradin Setin')}</h2>
              <p className={styles.sectionSubtitle}>
                {t('Configure your trading settings', 'Set u tradin way')}
              </p>

              <div className={styles.form}>
                <div className={styles.formGroup}>
                  <label>{t('Risk Tolerance', 'Risk Levl')}</label>
                  <select className={styles.select}>
                    <option>{t('Conservative', 'Sofri Sofri')}</option>
                    <option>{t('Moderate', 'Nomal')}</option>
                    <option>{t('Aggressive', 'Sharp')}</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>{t('Default Trade Size', 'Defolt Trade Saiz')}</label>
                  <input type="text" className={styles.input} placeholder="Le 100,000" />
                </div>

                <div className={styles.formGroup}>
                  <label>{t('Stop Loss %', 'Stop Loss %')}</label>
                  <input type="text" className={styles.input} placeholder="5%" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className={styles.section}>
              <h2>{t('Security', 'Sekyuniti')}</h2>
              <p className={styles.sectionSubtitle}>
                {t('Manage your account security', 'Manage u akont sekyuniti')}
              </p>

              <div className={styles.securityActions}>
                <button className={styles.securityBtn} onClick={handleChangePassword}>
                  {t('Change Password', 'Chenj Password')}
                </button>
                <button className={styles.securityBtn} onClick={() => alert('2FA Enabled!')}>
                  {t('Enable 2FA', 'On 2FA')}
                </button>
                <button className={`${styles.securityBtn} ${styles.danger}`}>
                  {t('Log Out', 'Komot')}
                </button>
              </div>
            </div>
          )}

          <div className={styles.actionButtons}>
            <button
              className={styles.btnSecondary}
              onClick={() => alert(t('Changes Discarded', 'Change no save'))}
            >
              {t('Cancel', 'Kansul')}
            </button>
            <button className={styles.btnPrimary} onClick={handleSave}>
              {t('Save All Changes', 'Save All Tin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
