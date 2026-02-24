import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import marketService from '../../services/marketService';
import styles from './Landing.module.css';

const Landing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hot');
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');

  // Tab configuration for fetching different data
  const tabConfig = {
    hot: { label: 'Hot', fetchFn: () => marketService.getTrendingCoins() },
    new: { label: 'New', fetchFn: () => marketService.getNewListings() },
    gainers: { label: 'Top Gainers', fetchFn: () => marketService.getTopGainers() },
    volume: { label: 'Top Volume', fetchFn: () => marketService.getTopVolume() },
  };

  // Fetch market data based on active tab
  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await tabConfig[activeTab].fetchFn();
      setMarketData(data);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to load market data. Please try again.');

      // Fallback to cached data or default
      setMarketData([
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          priceUsd: 68696.8,
          priceSll: 1628074360,
          change24h: -2.47,
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          priceUsd: 2015.63,
          priceSll: 47770521,
          change24h: -4.84,
        },
        { symbol: 'BNB', name: 'BNB', priceUsd: 619.28, priceSll: 14676936, change24h: -3.06 },
        { symbol: 'SOL', name: 'Solana', priceUsd: 82.6, priceSll: 1957620, change24h: -5.28 },
        { symbol: 'XRP', name: 'XRP', priceUsd: 1.4, priceSll: 33180, change24h: -3.12 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or tab changes
  useEffect(() => {
    fetchMarketData();
  }, [activeTab]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMarketData();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [activeTab]);

  // Handle sign up
  const handleSignUp = () => {
    if (email) {
      navigate('/register', { state: { email } });
    } else {
      navigate('/register');
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    alert('Google Sign-In coming soon! For now, please use email registration.');
  };

  // Handle Apple Sign-In
  const handleAppleSignIn = () => {
    // TODO: Implement Apple OAuth
    alert('Apple Sign-In coming soon! For now, please use email registration.');
  };

  return (
    <div className={styles.landing}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🇸🇱</span>
            <span className={styles.logoText}>LeoneAI</span>
          </div>
          <div className={styles.navLinks}>
            <Link to="/markets">Buy Crypto</Link>
            <Link to="/markets">Markets</Link>
            <Link to="/trading">Trade</Link>
            <Link to="/trading">Futures</Link>
            <Link to="/learn">Earn</Link>
          </div>
        </div>
        <div className={styles.navRight}>
          <Link to="/login" className={styles.loginBtn}>
            Log In
          </Link>
          <Link to="/register" className={styles.signupBtn}>
            Sign Up
          </Link>
          <div className={styles.settingsIcons}>
            <span>🌐</span>
            <span>🌙</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            <span className={styles.highlight}>Trade Crypto</span>
            <br />
            WITH LEONE (SLL)
          </h1>
          <p className={styles.heroSub}>The Most Trusted Cryptocurrency Exchange in Sierra Leone</p>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>🛡️</span>
              <div className={styles.statText}>
                <strong>Secure</strong>
                <span>Asset Fund</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statIcon}>🇸🇱</span>
              <div className={styles.statText}>
                <strong>Local</strong>
                <span>Payment Methods</span>
              </div>
            </div>
          </div>

          <div className={styles.heroActions}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Email/Phone number"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSignUp()}
              />
              <button className={styles.ctaBtn} onClick={handleSignUp}>
                Sign Up
              </button>
            </div>
            <div className={styles.socialAuth}>
              <button
                className={styles.socialBtn}
                onClick={handleGoogleSignIn}
                title="Sign in with Google"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
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
              </button>
              <button
                className={styles.socialBtn}
                onClick={handleAppleSignIn}
                title="Sign in with Apple"
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path
                    fill="currentColor"
                    d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                  />
                </svg>
              </button>
              <button className={styles.socialBtn} title="QR Code Sign-In">
                QR
              </button>
            </div>
          </div>
        </div>

        <div className={styles.heroImage}>{/* Abstract Phone/Chart Graphic could go here */}</div>
      </section>

      {/* Market Overview */}
      <section className={styles.markets}>
        <div className={styles.marketTabs}>
          {Object.entries(tabConfig).map(([key, config]) => (
            <button
              key={key}
              className={`${styles.tab} ${activeTab === key ? styles.active : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {config.label}
            </button>
          ))}
        </div>

        {error && (
          <div className={styles.errorBanner}>
            <span>⚠️</span> {error}
          </div>
        )}

        {loading ? (
          <div className={styles.loadingGrid}>
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}></div>
                <div className={styles.skeletonPrice}></div>
                <div className={styles.skeletonSub}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.marketGrid}>
            {marketData.slice(0, 5).map((item, idx) => (
              <div key={item.id || idx} className={styles.marketCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.coinSymbol}>{item.symbol}</span>
                  <span
                    className={`${styles.change} ${item.change24h >= 0 ? styles.up : styles.down}`}
                  >
                    {item.change24h >= 0 ? '+' : ''}
                    {item.change24h?.toFixed(2)}%
                  </span>
                </div>
                <div className={styles.price}>
                  $
                  {item.priceUsd?.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className={styles.priceSll}>
                  ≈ Le {item.priceSll?.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.viewAll}>
          <Link to="/markets">View All 350+ Coins &gt;</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <div className={styles.col}>
            <h4>About Us</h4>
            <Link to="/about">About</Link>
            <a href="#">Careers</a>
            <a href="#">Announcements</a>
            <a href="#">News</a>
            <a href="#">Press</a>
            <a href="#">Legal</a>
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
          <div className={styles.col}>
            <h4>Products</h4>
            <Link to="/markets">Exchange</Link>
            <Link to="/markets">Buy Crypto</Link>
            <a href="#">Pay</a>
            <Link to="/learn">Academy</Link>
            <a href="#">Launchpool</a>
            <a href="#">Auto-Invest</a>
          </div>
          <div className={styles.col}>
            <h4>Business</h4>
            <a href="#">P2P Merchant</a>
            <a href="#">P2Pro Merchant</a>
            <a href="#">Listing Application</a>
            <a href="#">Labs</a>
            <a href="#">Institutional</a>
          </div>
          <div className={styles.col}>
            <h4>Service</h4>
            <a href="#">Affiliate</a>
            <a href="#">Referral</a>
            <a href="#">OTC Trading</a>
            <a href="#">Historical Data</a>
            <a href="#">Proof of Reserves</a>
          </div>
          <div className={styles.col}>
            <h4>Support</h4>
            <a href="#">24/7 Chat Support</a>
            <a href="#">Support Center</a>
            <a href="#">Product Feedback</a>
            <a href="#">Fees</a>
            <a href="#">Trading Rules</a>
            <a href="#">LeoneAI Verify</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>LeoneAI © 2024</p>
          <div className={styles.socials}>
            <span>Discord</span>
            <span>Telegram</span>
            <span>TikTok</span>
            <span>Facebook</span>
            <span>Twitter</span>
            <span>Instagram</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
