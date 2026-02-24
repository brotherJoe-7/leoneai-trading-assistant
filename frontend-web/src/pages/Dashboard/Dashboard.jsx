import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { portfolioAPI, signalsAPI } from '../../services/api';
import { formatLeone, formatPercent } from '../../utils/formatters';
import { useMarketWebSocket } from '../../hooks/useWebSocket';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [portfolioStats, setPortfolioStats] = useState(null);
  const [recentSignals, setRecentSignals] = useState([]);
  const [error, setError] = useState(null);
  const [chartInterval, setChartInterval] = useState('1D');

  // WebSocket for real-time BTC price
  const {
    price: btcPrice,
    connected: btcConnected,
    error: btcError,
  } = useMarketWebSocket('BTC-USD');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, signals] = await Promise.all([
        portfolioAPI.getStats().catch(() => null),
        signalsAPI.getRecentSignals(5).catch(() => []),
      ]);

      setPortfolioStats(stats);
      setRecentSignals(signals);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Fallback mock data if API fails
  const mockStats = {
    total_value: 15250000,
    daily_change: 2.45,
    total_profit: 183000,
    profit_percent: 1.2,
  };

  const mockSignals = [
    { id: 1, pair: 'USD/SLL', action: 'BUY', confidence: 92, price: '22,160' },
    { id: 2, pair: 'BTC/USD', action: 'SELL', confidence: 78, price: '54,126' },
    { id: 3, pair: 'EUR/SLL', action: 'HOLD', confidence: 65, price: '24,053' },
  ];

  const stats = portfolioStats || mockStats;
  const signals = recentSignals.length > 0 ? recentSignals : mockSignals;

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here's your trading overview.</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchDashboardData}>
          <span>🔄</span> Refresh
        </button>
      </header>

      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️</span> {error} - Showing cached data
        </div>
      )}

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Portfolio Value</span>
            <span className={styles.statIcon}>💼</span>
          </div>
          <h2 className={styles.statValue}>{formatLeone(stats.total_value || 0)}</h2>
          <p className={styles.statChange}>
            <span className={styles.positive}>{formatPercent(stats.daily_change || 0)}</span>
            <span className={styles.statPeriod}>Past 24 Hours</span>
          </p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Profit</span>
            <span className={styles.statIcon}>💰</span>
          </div>
          <h2 className={styles.statValue}>{formatLeone(stats.total_profit || 0)}</h2>
          <p className={styles.statChange}>
            <span className={styles.positive}>{formatPercent(stats.profit_percent || 0)}</span>
            <span className={styles.statPeriod}>All Time</span>
          </p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Signal Accuracy</span>
            <span className={styles.statIcon}>🎯</span>
          </div>
          <h2 className={styles.statValue}>84.2%</h2>
          <p className={styles.statChange}>
            <span className={styles.positive}>↗ +2.1%</span>
            <span className={styles.statPeriod}>Past 30 Days</span>
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* BTC/SLL Chart */}
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div>
              <h3>BTC / SLL</h3>
              {btcPrice ? (
                <>
                  <p className={styles.currentPrice}>
                    Le{' '}
                    {(btcPrice.price * 23700).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </p>
                  <p className={styles.usdPrice}>
                    ${btcPrice.price.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
                  </p>
                  <span className={btcPrice.change >= 0 ? styles.positive : styles.negative}>
                    {btcPrice.change >= 0 ? '↗' : '↘'} {btcPrice.change_percent.toFixed(2)}%
                  </span>
                </>
              ) : (
                <p className={styles.currentPrice}>Le 1,245,320,000</p>
              )}
              {btcConnected && (
                <span className={styles.liveIndicator}>
                  <span className={styles.liveDot}></span> LIVE
                </span>
              )}
              {btcError && <span className={styles.errorIndicator}>⚠️ {btcError}</span>}
            </div>
            <div className={styles.timeframeTabs}>
              <button
                className={`${styles.tabBtn} ${chartInterval === '1D' ? styles.active : ''}`}
                onClick={() => setChartInterval('1D')}
              >
                1D
              </button>
              <button
                className={`${styles.tabBtn} ${chartInterval === '1W' ? styles.active : ''}`}
                onClick={() => setChartInterval('1W')}
              >
                1W
              </button>
              <button
                className={`${styles.tabBtn} ${chartInterval === '1M' ? styles.active : ''}`}
                onClick={() => setChartInterval('1M')}
              >
                1M
              </button>
            </div>
          </div>
          <div className={styles.chartArea}>
            <svg viewBox="0 0 700 250" className={styles.chart}>
              <path
                d="M 0 200 L 100 180 L 200 150 L 300 120 L 400 140 L 500 100 L 600 80 L 700 60"
                fill="none"
                stroke="var(--primary-green)"
                strokeWidth="3"
              />
              <path
                d="M 0 200 L 100 180 L 200 150 L 300 120 L 400 140 L 500 100 L 600 80 L 700 60 L 700 250 L 0 250 Z"
                fill="url(#gradient)"
                opacity="0.3"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary-green)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="var(--primary-green)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* AI Analysis */}
        <div className={styles.aiCard}>
          <div className={styles.aiHeader}>
            <span className={styles.aiIcon}>🤖</span>
            <h3>AI Analysis</h3>
          </div>
          <div className={styles.aiRecommendation}>
            <span className={styles.recommendBadge}>RECOMMENDED</span>
            <h4>BUY USD/SLL</h4>
            <p>
              AI confidence: <strong>92%</strong>
            </p>
          </div>
          <p className={styles.aiReasoning}>
            Detected a wedge breakout on the 4H chart. Increasing import demand in Freetown suggests
            SLL liquidity absorption.
          </p>
          <button className={styles.btnPrimary} onClick={() => navigate('/signals')}>
            View Full Analysis
          </button>
        </div>
      </div>

      {/* Recent Signals Table */}
      <div className={styles.signalsSection}>
        <div className={styles.sectionHeader}>
          <h3>Recent Signals</h3>
          <button className={styles.linkBtn} onClick={() => navigate('/signals')}>
            View All →
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pair</th>
                <th>Action</th>
                <th>Confidence</th>
                <th>Current Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((signal, index) => (
                <tr key={signal.id || index}>
                  <td className={styles.pairCell}>
                    <span className={styles.pairIcon}>💱</span>
                    {signal.pair}
                  </td>
                  <td>
                    <span
                      className={`${styles.actionBadge} ${
                        signal.action === 'BUY'
                          ? styles.buy
                          : signal.action === 'SELL'
                            ? styles.sell
                            : styles.hold
                      }`}
                    >
                      {signal.action}
                    </span>
                  </td>
                  <td>{signal.confidence}%</td>
                  <td>Le {signal.price}</td>
                  <td>
                    <button className={styles.actionBtn} onClick={() => navigate('/signals')}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
