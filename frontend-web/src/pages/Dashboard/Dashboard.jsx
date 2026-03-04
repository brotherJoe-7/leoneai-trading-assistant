import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { portfolioAPI, signalsAPI } from '../../services/api';
import styles from './Dashboard.module.css';

// Live price hook using Binance WebSocket
const useLivePrice = symbol => {
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(0);
  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`);
    ws.onmessage = e => {
      const d = JSON.parse(e.data);
      setPrice(parseFloat(d.c));
      setChange(parseFloat(d.P));
    };
    ws.onerror = () => ws.close();
    return () => ws.close();
  }, [symbol]);
  return { price, change };
};

// Animated number counter
const Counter = ({ value, prefix = '', suffix = '', decimals = 0 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    if (end === 0) {
      setDisplay(0);
      return;
    }
    const step = end / 40;
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setDisplay(start);
      if (start >= end) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return (
    <>
      {prefix}
      {display.toLocaleString(undefined, { maximumFractionDigits: decimals })}
      {suffix}
    </>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [portfolioStats, setPortfolioStats] = useState(null);
  const [recentSignals, setRecentSignals] = useState([]);
  const [topSignal, setTopSignal] = useState(null);

  const { price: btcPrice, change: btcChange } = useLivePrice('BTCUSDT');
  const { price: ethPrice, change: ethChange } = useLivePrice('ETHUSDT');
  const { price: bnbPrice, change: bnbChange } = useLivePrice('BNBUSDT');

  // SLL exchange rate (approx)
  const USD_TO_SLL = 22500;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [stats, signals] = await Promise.all([
      portfolioAPI.getStats().catch(() => null),
      signalsAPI.getRecentSignals(5).catch(() => []),
    ]);
    setPortfolioStats(stats);
    const sigArr = Array.isArray(signals) ? signals : signals?.signals || [];
    setRecentSignals(sigArr.slice(0, 4));
    setTopSignal(sigArr.find(s => s.action === 'BUY' && s.confidence > 75) || sigArr[0]);
    setLoading(false);
  };

  const balance = portfolioStats?.total_value ?? portfolioStats?.cash_balance_sll ?? 0;
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };
  const displayName = user?.full_name?.split(' ')[0] || user?.username || 'Trader';

  if (loading)
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingLogo}>🇸🇱</div>
        <div className={styles.loadingBar}>
          <div className={styles.loadingFill} />
        </div>
        <p>Loading your dashboard...</p>
      </div>
    );

  return (
    <div className={styles.dashboard}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.greeting}>
            {greeting()}, <span className={styles.goldName}>{displayName}</span> 👋
          </h1>
          <p className={styles.subtitle}>
            Here's your trading overview —{' '}
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.depositBtn} onClick={() => navigate('/portfolio')}>
            + Deposit
          </button>
          <button className={styles.tradeBtn} onClick={() => navigate('/trading')}>
            ⚡ Trade Now
          </button>
        </div>
      </div>

      {/* ── Balance Hero Card ── */}
      <div className={styles.balanceCard}>
        <div className={styles.balanceGlow} />
        <div className={styles.balanceLeft}>
          <p className={styles.balanceLabel}>Total Portfolio Balance</p>
          <h2 className={styles.balanceAmount}>
            Le <Counter value={balance} decimals={0} />
          </h2>
          <p className={styles.balanceUSD}>
            ≈ $
            {balance > 0
              ? (balance / USD_TO_SLL).toLocaleString(undefined, { maximumFractionDigits: 2 })
              : '0.00'}{' '}
            USD
          </p>
          <div className={styles.balanceBadge}>
            <span className={styles.badgeDot} />
            <span>Live Balance — Sierra Leone Leones (SLL)</span>
          </div>
        </div>
        <div className={styles.balanceRight}>
          <div className={styles.balanceStat}>
            <span>Daily P&L</span>
            <strong className={styles.statNeutral}>Le 0</strong>
          </div>
          <div className={styles.balanceStat}>
            <span>Plan</span>
            <strong className={styles.statGold}>{user?.plan_type || 'FREE'}</strong>
          </div>
          <div className={styles.balanceStat}>
            <span>Signals Today</span>
            <strong>{recentSignals.length}</strong>
          </div>
        </div>
      </div>

      {/* ── Live Market Strip ── */}
      <div className={styles.marketStrip}>
        {[
          { name: 'BTC/USDT', price: btcPrice, change: btcChange, icon: '₿', color: '#f7931a' },
          { name: 'ETH/USDT', price: ethPrice, change: ethChange, icon: 'Ξ', color: '#627eea' },
          { name: 'BNB/USDT', price: bnbPrice, change: bnbChange, icon: '◆', color: '#f3ba2f' },
          { name: 'USD/SLL', price: 22500, change: 0.12, icon: '$', color: '#22c55e' },
        ].map((m, i) => (
          <div key={i} className={styles.marketCard}>
            <div className={styles.marketIcon} style={{ color: m.color }}>
              {m.icon}
            </div>
            <div className={styles.marketInfo}>
              <span className={styles.marketName}>{m.name}</span>
              <span className={styles.marketPrice}>
                {m.price
                  ? `$${m.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                  : '—'}
              </span>
            </div>
            <span className={`${styles.marketChange} ${m.change >= 0 ? styles.up : styles.down}`}>
              {m.change >= 0 ? '+' : ''}
              {m.change?.toFixed(2) || '0.00'}%
            </span>
          </div>
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className={styles.mainGrid}>
        {/* AI Insight Panel */}
        <div className={styles.aiPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelIcon}>🤖</div>
            <div>
              <h3 className={styles.panelTitle}>AI Market Insight</h3>
              <p className={styles.panelSub}>Powered by LeoneAI Analysis Engine</p>
            </div>
            <div className={styles.aiLiveDot}>
              <span>LIVE</span>
            </div>
          </div>
          {topSignal ? (
            <div className={styles.aiHighlight}>
              <div className={styles.aiAction} data-action={topSignal.action}>
                {topSignal.action}
              </div>
              <div className={styles.aiContent}>
                <div className={styles.aiPair}>{topSignal.symbol || topSignal.pair}</div>
                <div className={styles.aiReason}>{topSignal.reason}</div>
                <div className={styles.aiMeta}>
                  <span>Strategy: {topSignal.strategy}</span>
                  <span>Timeframe: {topSignal.timeframe}</span>
                  <span>Risk: {topSignal.risk}</span>
                </div>
                <div className={styles.confidenceRow}>
                  <span className={styles.confidenceLabel}>AI Confidence</span>
                  <div className={styles.confidenceBar}>
                    <div
                      className={styles.confidenceFill}
                      style={{
                        width: `${topSignal.confidence}%`,
                        background:
                          topSignal.confidence > 80
                            ? '#22c55e'
                            : topSignal.confidence > 65
                              ? '#f59e0b'
                              : '#ef4444',
                      }}
                    />
                  </div>
                  <span className={styles.confidenceNum}>{topSignal.confidence?.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.aiEmpty}>🔍 Scanning markets for opportunities...</div>
          )}
          <button className={styles.viewAllBtn} onClick={() => navigate('/signals')}>
            View All Signals →
          </button>
        </div>

        {/* Recent Signals */}
        <div className={styles.signalsPanel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>⚡ Recent Signals</h3>
            <button className={styles.refreshBtn} onClick={fetchData}>
              ↻ Refresh
            </button>
          </div>
          <div className={styles.signalsList}>
            {recentSignals.length > 0 ? (
              recentSignals.map(sig => (
                <div key={sig.id} className={styles.signalRow}>
                  <div className={`${styles.sigAction} ${styles[`sig${sig.action}`]}`}>
                    {sig.action}
                  </div>
                  <div className={styles.sigInfo}>
                    <span className={styles.sigPair}>{sig.symbol || sig.pair}</span>
                    <span className={styles.sigStrategy}>{sig.strategy}</span>
                  </div>
                  <div className={styles.sigConf}>
                    <span className={styles.sigConfNum}>{sig.confidence?.toFixed(0)}%</span>
                    <span className={styles.sigRisk} data-risk={sig.risk?.toLowerCase()}>
                      {sig.risk}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.emptyMsg}>Signals loading...</p>
            )}
          </div>
        </div>
      </div>

      {/* ── TradingView Chart + Quick Actions ── */}
      <div className={styles.bottomGrid}>
        <div className={styles.chartPanel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>📊 BTC/USDT Live Chart</h3>
            <span className={styles.chartBadge}>TradingView</span>
          </div>
          <div className={styles.chartContainer}>
            <iframe
              src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=BINANCE%3ABTCUSDT&interval=60&hidesidetoolbar=1&hidetoptoolbar=0&symboledit=1&saveimage=0&toolbarbg=0a1628&studies=[]&theme=dark&style=1&timezone=Africa%2FFreetown&withdateranges=1&showpopupbutton=1&studies_overrides={}&overrides={%22mainSeriesProperties.candleStyle.upColor%22:%22%2322c55e%22,%22mainSeriesProperties.candleStyle.downColor%22:%22%23ef4444%22}&enabled_features=[]&disabled_features=[move_logo_to_main_pane]&locale=en&utm_source=leoneai&utm_medium=widget"
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="BTC/USDT Chart"
              allowFullScreen
            />
          </div>
        </div>

        <div className={styles.quickActions}>
          <h3 className={styles.panelTitle}>🎯 Quick Actions</h3>
          <div className={styles.actionGrid}>
            {[
              {
                icon: '💰',
                label: 'Deposit Funds',
                desc: 'Add money to trade',
                action: () => navigate('/portfolio'),
                btn: 'Deposit',
                color: '#22c55e',
              },
              {
                icon: '🚀',
                label: 'Pro Trading',
                desc: 'Advanced terminal',
                action: () => navigate('/trading'),
                btn: 'Open',
                color: '#d4a832',
              },
              {
                icon: '⚡',
                label: 'AI Signals',
                desc: `${recentSignals.length} active now`,
                action: () => navigate('/signals'),
                btn: 'View',
                color: '#8b5cf6',
              },
              {
                icon: '📈',
                label: 'Live Markets',
                desc: 'Real-time prices',
                action: () => navigate('/markets'),
                btn: 'Explore',
                color: '#0ea5e9',
              },
            ].map((a, i) => (
              <div key={i} className={styles.actionCard}>
                <div
                  className={styles.actionIcon}
                  style={{ background: `${a.color}20`, color: a.color }}
                >
                  {a.icon}
                </div>
                <div className={styles.actionText}>
                  <span className={styles.actionLabel}>{a.label}</span>
                  <span className={styles.actionDesc}>{a.desc}</span>
                </div>
                <button
                  className={styles.actionBtn}
                  style={{ background: a.color }}
                  onClick={a.action}
                >
                  {a.btn}
                </button>
              </div>
            ))}
          </div>

          <div className={styles.learnCard}>
            <div className={styles.learnIcon}>📚</div>
            <div>
              <p className={styles.learnTitle}>New to trading?</p>
              <p className={styles.learnDesc}>
                Learn how to trade with our free courses designed for Sierra Leone.
              </p>
            </div>
            <button className={styles.learnBtn} onClick={() => navigate('/learn')}>
              Start →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
