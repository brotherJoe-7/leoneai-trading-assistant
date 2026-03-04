import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';

const TICKER_PAIRS = [
  { sym: 'BTC/SLL', stream: 'btcusdt', mul: 22500, icon: '₿', color: '#f7931a' },
  { sym: 'ETH/SLL', stream: 'ethusdt', mul: 22500, icon: 'Ξ', color: '#627eea' },
  { sym: 'USD/SLL', stream: null, price: 22500, change: 0.12, icon: '$', color: '#22c55e' },
  { sym: 'GBP/SLL', stream: null, price: 28600, change: -0.08, icon: '£', color: '#d4a832' },
];

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Market Intelligence',
    desc: 'Our engine scans global markets 24/7, identifying patterns and giving you clear BUY/SELL/HOLD signals with reasoning.',
  },
  {
    icon: '⛓',
    title: 'Blockchain Payments',
    desc: 'Deposit via Bitcoin, Ethereum, or USDT. On-chain verified, transparent, and instant — alongside Orange Money & Afrimoney.',
  },
  {
    icon: '🇸🇱',
    title: 'Built for Sierra Leone',
    desc: 'Trade in Leones (SLL). Fund via Orange Money and Afrimoney. Analysis tailored for our local and regional markets.',
  },
  {
    icon: '📊',
    title: 'Professional Trading Tools',
    desc: 'Real-time charts, order book, stop-loss, limit orders — everything professional traders use, simplified for everyone.',
  },
  {
    icon: '📚',
    title: 'Learn to Trade Free',
    desc: 'New to trading? Our free courses take you from absolute beginner to confident trader, in plain Sierra Leonean language.',
  },
  {
    icon: '🔒',
    title: 'Bank-Grade Security',
    desc: 'JWT authentication, encrypted data, and 2FA support. Your funds and information are always protected.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Abubakarr K.',
    role: 'Small Business Owner, Bo',
    msg: 'LeoneAI di help mi understand di market better. I done make profit on mi first BTC trade!',
  },
  {
    name: 'Fatmata S.',
    role: 'Nurse, Freetown',
    msg: 'Di Afrimoney deposit is easy and di AI signals are simple to understand. I start trading now.',
  },
  {
    name: 'Mohamed J.',
    role: 'Student, Njala University',
    msg: 'The learning section taught me everything. The AI assistant guides you step by step. Game changer!',
  },
];

const Landing = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState({});

  useEffect(() => {
    // Fetch live BTC/ETH prices
    const fetchPrices = async () => {
      try {
        const r = await fetch(
          'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT"]'
        );
        const data = await r.json();
        const p = {};
        data.forEach(d => {
          p[d.symbol] = {
            price: parseFloat(d.lastPrice),
            change: parseFloat(d.priceChangePercent),
          };
        });
        setPrices(p);
      } catch (_) {}
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.landing}>
      {/* ── Nav ── */}
      <nav className={styles.nav}>
        <div className={styles.navLogo}>
          <span className={styles.flag}>🇸🇱</span>
          <div>
            <span className={styles.logoName}>LeoneAI</span>
            <span className={styles.logoTag}>AI Trading Platform</span>
          </div>
        </div>
        <div className={styles.navLinks}>
          <a href="#features">Features</a>
          <a href="#markets">Markets</a>
          <a href="#about">About</a>
        </div>
        <div className={styles.navActions}>
          <button className={styles.loginBtn} onClick={() => navigate('/login')}>
            Sign In
          </button>
          <button className={styles.registerBtn} onClick={() => navigate('/register')}>
            Get Started Free
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
          <div className={styles.heroGrid} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            <span>🇸🇱 Proudly Made in Sierra Leone</span>
          </div>
          <h1 className={styles.heroTitle}>
            Trade Smarter <br />
            with <span className={styles.heroGold}>AI Intelligence</span>
          </h1>
          <p className={styles.heroDesc}>
            LeoneAI is Sierra Leone's first AI-powered trading platform. Get real-time market
            signals, trade Bitcoin, ETH, and Forex — all in Sierra Leone Leones. Fund with Orange
            Money, Afrimoney, or crypto. No experience needed.
          </p>
          <div className={styles.heroCTA}>
            <button className={styles.ctaPrimary} onClick={() => navigate('/register')}>
              Start Trading Free →
            </button>
            <button className={styles.ctaSecondary} onClick={() => navigate('/login')}>
              Sign In to Dashboard
            </button>
          </div>
          <div className={styles.heroStats}>
            {[
              { val: '10+', label: 'AI Signals Daily' },
              { val: 'SLL', label: 'Native Currency' },
              { val: '24/7', label: 'Market Coverage' },
              { val: 'Free', label: 'To Get Started' },
            ].map((s, i) => (
              <div key={i} className={styles.heroStat}>
                <strong>{s.val}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Price Cards */}
        <div className={styles.heroPrices}>
          <div className={styles.priceCardHeader}>
            <div className={styles.liveIndicator}>
              <span />
            </div>
            <span>Live Market Prices</span>
          </div>
          {TICKER_PAIRS.map((pair, i) => {
            const data =
              pair.stream === 'btcusdt'
                ? prices['BTCUSDT']
                : pair.stream === 'ethusdt'
                  ? prices['ETHUSDT']
                  : null;
            const rawPrice = data?.price || pair.price || 0;
            const sllPrice = pair.mul ? rawPrice * pair.mul : rawPrice;
            const change = data?.change ?? pair.change ?? 0;
            return (
              <div key={i} className={styles.priceCard}>
                <div className={styles.priceCoin}>
                  <span style={{ color: pair.color, fontWeight: 800, fontSize: '1.1rem' }}>
                    {pair.icon}
                  </span>
                  <span className={styles.priceSym}>{pair.sym}</span>
                </div>
                <div className={styles.priceRight}>
                  <span className={styles.priceVal}>
                    Le {Math.round(sllPrice).toLocaleString()}
                  </span>
                  <span className={`${styles.priceChg} ${change >= 0 ? styles.up : styles.down}`}>
                    {change >= 0 ? '+' : ''}
                    {change.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
          <button className={styles.pricesViewAll} onClick={() => navigate('/login')}>
            View All Markets →
          </button>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.features} id="features">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Why LeoneAI</span>
          <h2 className={styles.sectionTitle}>Everything You Need to Trade Like a Pro</h2>
          <p className={styles.sectionDesc}>
            Built specifically for Sierra Leone's market — combining global trading tools with local
            payment methods and AI intelligence.
          </p>
        </div>
        <div className={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Showcase ── */}
      <section className={styles.aiShowcase}>
        <div className={styles.aiShowcaseContent}>
          <span className={styles.sectionTag}>AI-Powered</span>
          <h2 className={styles.sectionTitle}>
            Your Personal Trading <span className={styles.heroGold}>AI Assistant</span>
          </h2>
          <p className={styles.sectionDesc}>
            Our AI engine analyzes market data continuously — RSI, MACD, support/resistance, volume
            patterns — and converts complex signals into simple, actionable advice even a first-time
            trader can follow.
          </p>
          <div className={styles.aiFeatureList}>
            {[
              'Scans 20+ trading pairs 24/7',
              'Explains reasoning in plain language',
              'Confidence score for every signal',
              'SLL-denominated entry & exit prices',
              'Alerts when high-confidence signals are detected',
            ].map((item, i) => (
              <div key={i} className={styles.aiFeatureItem}>
                <span className={styles.checkIcon}>✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <button
            className={styles.ctaPrimary}
            onClick={() => navigate('/register')}
            style={{ marginTop: '2rem', display: 'inline-block' }}
          >
            Try AI Signals Free →
          </button>
        </div>
        <div className={styles.aiShowcaseCard}>
          <div className={styles.mockSignal}>
            <div className={styles.mockHeader}>
              <span>🤖 AI Market Analysis</span>
              <span className={styles.mockLive}>LIVE</span>
            </div>
            {[
              {
                pair: 'BTC/SLL',
                action: 'BUY',
                conf: 87,
                reason: 'RSI oversold at 28. MACD bullish crossover.',
              },
              {
                pair: 'USD/SLL',
                action: 'BUY',
                conf: 93,
                reason: 'Import demand surge. Breakout confirmed.',
              },
              {
                pair: 'ETH/SLL',
                action: 'HOLD',
                conf: 61,
                reason: 'Consolidating above key support.',
              },
            ].map((s, i) => (
              <div key={i} className={styles.mockSig}>
                <div className={`${styles.mockAction} ${styles[`mock${s.action}`]}`}>
                  {s.action}
                </div>
                <div className={styles.mockInfo}>
                  <span className={styles.mockPair}>{s.pair}</span>
                  <span className={styles.mockReason}>{s.reason}</span>
                </div>
                <div className={styles.mockConf}>{s.conf}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className={styles.testimonials}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Community</span>
          <h2 className={styles.sectionTitle}>Sierra Leoneans Are Already Trading</h2>
        </div>
        <div className={styles.testimonialGrid}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className={styles.testimonialCard}>
              <p className={styles.testimonialMsg}>"{t.msg}"</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>{t.name[0]}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerGlow} />
        <h2>Ready to Start Trading?</h2>
        <p>
          Join thousands of Sierra Leoneans trading smarter with AI. Free to start, no experience
          needed.
        </p>
        <button className={styles.ctaPrimary} onClick={() => navigate('/register')}>
          Create Free Account →
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>🇸🇱 LeoneAI</div>
            <p>Sierra Leone's first AI-powered trading platform. Built with ❤️ in Freetown.</p>
          </div>
          <div className={styles.footerLinks}>
            <div>
              <h4>Platform</h4>
              <a onClick={() => navigate('/login')}>Dashboard</a>
              <a onClick={() => navigate('/login')}>Markets</a>
              <a onClick={() => navigate('/login')}>AI Signals</a>
              <a onClick={() => navigate('/login')}>Pro Trading</a>
            </div>
            <div>
              <h4>Learn</h4>
              <a onClick={() => navigate('/login')}>Beginner Guide</a>
              <a onClick={() => navigate('/login')}>Trading Basics</a>
              <a onClick={() => navigate('/login')}>AI Trading</a>
            </div>
            <div>
              <h4>Support</h4>
              <a>Contact Us</a>
              <a>WhatsApp</a>
              <a>FAQ</a>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>© 2026 LeoneAI. Sierra Leone's AI Trading Platform. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '1rem', color: '#3d556e', fontSize: '0.75rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
