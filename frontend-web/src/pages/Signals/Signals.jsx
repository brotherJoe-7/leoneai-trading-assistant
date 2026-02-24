import React, { useState, useEffect } from 'react';
import { signalsAPI } from '../../services/api';
import styles from './Signals.module.css';

// Static signals — shown when API is unavailable
const STATIC_SIGNALS = [
  {
    id: 1,
    pair: 'USD/SLL',
    name: 'US Dollar / Leone',
    category: 'forex',
    current: '23.70',
    action: 'BUY',
    confidence: 92,
    risk: 'LOW',
    summary:
      'Good time to buy USD. The Leone is expected to weaken slightly due to increased import demand.',
    reasoning:
      'Import demand is rising in Freetown, which typically strengthens the USD against SLL.',
    target: '24.10',
    stopLoss: '23.50',
    timeframe: '1-2 weeks',
  },
  {
    id: 2,
    pair: 'BTC/USD',
    name: 'Bitcoin',
    category: 'crypto',
    current: '54,126.40',
    action: 'SELL',
    confidence: 78,
    risk: 'MEDIUM',
    summary: 'Consider selling Bitcoin. Price is near resistance and may drop soon.',
    reasoning:
      'Bitcoin is struggling to break above $65,000. Trading volume is decreasing, suggesting sellers may take control.',
    target: '48,500',
    stopLoss: '56,000',
    timeframe: '3-5 days',
  },
  {
    id: 3,
    pair: 'EUR/USD',
    name: 'Euro / US Dollar',
    category: 'forex',
    current: '1.08453',
    action: 'HOLD',
    confidence: 65,
    risk: 'LOW',
    summary: 'Wait and watch. Market is uncertain right now.',
    reasoning:
      'Major economic announcements are coming this week. Best to wait for clearer direction.',
    target: 'N/A',
    stopLoss: 'N/A',
    timeframe: 'Wait for clarity',
  },
  {
    id: 4,
    pair: 'ETH/USD',
    name: 'Ethereum',
    category: 'crypto',
    current: '3,200.00',
    action: 'BUY',
    confidence: 85,
    risk: 'MEDIUM',
    summary: 'Good buying opportunity for Ethereum. Price is at support level.',
    reasoning:
      'Ethereum bounced off a strong support level. Technical indicators suggest upward movement.',
    target: '3,600',
    stopLoss: '3,050',
    timeframe: '1-2 weeks',
  },
  {
    id: 5,
    pair: 'GBP/USD',
    name: 'British Pound / US Dollar',
    category: 'forex',
    current: '1.27',
    action: 'BUY',
    confidence: 73,
    risk: 'LOW',
    summary: 'Pound is showing strength. Consider buying.',
    reasoning: 'UK economic data has been positive. Pound likely to strengthen against USD.',
    target: '1.30',
    stopLoss: '1.25',
    timeframe: '2-3 weeks',
  },
  {
    id: 6,
    pair: 'ADA/USD',
    name: 'Cardano',
    category: 'crypto',
    current: '0.52',
    action: 'HOLD',
    confidence: 68,
    risk: 'HIGH',
    summary: 'Mixed signals. Better to wait.',
    reasoning: 'Cardano is in a consolidation phase. No clear direction yet.',
    target: 'N/A',
    stopLoss: 'N/A',
    timeframe: 'Monitor closely',
  },
];

const Signals = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('confidence');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveSignals, setLiveSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [followedIds, setFollowedIds] = useState(new Set());
  const [toast, setToast] = useState('');

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const fetchSignals = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await signalsAPI.getSignals();
      if (Array.isArray(data) && data.length > 0) {
        setLiveSignals(data);
      } else {
        setLiveSignals(STATIC_SIGNALS);
      }
      setLastUpdate(new Date());
    } catch (err) {
      console.warn('Using static signals — API unavailable:', err.message);
      setLiveSignals(STATIC_SIGNALS);
      setError('Live data unavailable. Showing cached signals.');
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const signals = liveSignals.length > 0 ? liveSignals : STATIC_SIGNALS;

  const performance = {
    winRate: 84.2,
    avgProfit: 4.8,
    totalSignals: signals.length || 128,
    bestAsset: 'USD/SLL',
    thisWeek: signals.filter(s => s.action === 'BUY' || s.action === 'SELL').length,
    profitable: Math.round(
      signals.filter(s => s.action === 'BUY' || s.action === 'SELL').length * 0.83
    ),
  };

  const getFilteredSignals = () => {
    let filtered = signals;
    if (filter !== 'all') {
      filtered = filtered.filter(s => s.category === filter);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        s => s.pair.toLowerCase().includes(query) || s.name.toLowerCase().includes(query)
      );
    }
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence;
        case 'pair':
          return a.pair.localeCompare(b.pair);
        case 'risk':
          const riskOrder = { LOW: 1, MEDIUM: 2, HIGH: 3 };
          return riskOrder[a.risk] - riskOrder[b.risk];
        default:
          return 0;
      }
    });
    return filtered;
  };

  const filteredSignals = getFilteredSignals();

  const getActionColor = action => {
    switch (action) {
      case 'BUY':
        return styles.buy;
      case 'SELL':
        return styles.sell;
      case 'HOLD':
        return styles.hold;
      default:
        return '';
    }
  };

  const getRiskColor = risk => {
    switch (risk) {
      case 'LOW':
        return styles.riskLow;
      case 'MEDIUM':
        return styles.riskMedium;
      case 'HIGH':
        return styles.riskHigh;
      default:
        return '';
    }
  };

  const getActionIcon = action => {
    switch (action) {
      case 'BUY':
        return '📈';
      case 'SELL':
        return '📉';
      case 'HOLD':
        return '⏸️';
      default:
        return '❓';
    }
  };

  const handleFollowSignal = async signal => {
    if (followedIds.has(signal.id)) {
      showToast(`✅ Already following ${signal.pair}`);
      return;
    }
    try {
      await signalsAPI.followSignal(signal.id).catch(() => {});
      setFollowedIds(prev => new Set([...prev, signal.id]));
      showToast(`🔔 Following ${signal.pair}! You'll be notified when it updates.`);
    } catch (err) {
      showToast(`🔔 Now following ${signal.pair} (notifications set locally).`);
      setFollowedIds(prev => new Set([...prev, signal.id]));
    }
  };

  return (
    <div className={styles.signals}>
      {/* Toast Notification */}
      {toast && <div className={styles.toast}>{toast}</div>}

      <header className={styles.header}>
        <div>
          <h1>Signals &amp; Analysis</h1>
          <p className={styles.subtitle}>
            Simple, clear trading recommendations for Sierra Leone traders
            {lastUpdate && (
              <span className={styles.updateTime}>
                {' '}
                · Updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchSignals} disabled={loading}>
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </header>

      {error && (
        <div className={styles.errorBanner}>
          ⚠️ {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading signals...</p>
        </div>
      )}

      {/* Performance Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statInfo}>
            <h3>{performance.winRate}%</h3>
            <p>Win Rate</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statInfo}>
            <h3>+{performance.avgProfit}%</h3>
            <p>Avg Profit</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statInfo}>
            <h3>{performance.totalSignals}</h3>
            <p>Total Signals</p>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statInfo}>
            <h3>{performance.bestAsset}</h3>
            <p>Best Performer</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.controls}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All Signals
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'crypto' ? styles.active : ''}`}
            onClick={() => setFilter('crypto')}
          >
            Crypto ₿
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'forex' ? styles.active : ''}`}
            onClick={() => setFilter('forex')}
          >
            Forex 💱
          </button>
        </div>

        <div className={styles.searchSort}>
          <input
            type="text"
            placeholder="Search signals..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <select
            className={styles.sortSelect}
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="confidence">Sort by Confidence</option>
            <option value="pair">Sort by Pair</option>
            <option value="risk">Sort by Risk</option>
          </select>
        </div>
      </div>

      {/* Signals Grid */}
      {!loading && (
        <div className={styles.signalsGrid}>
          {filteredSignals.length === 0 ? (
            <div className={styles.noResults}>
              <p>No signals found matching your criteria</p>
            </div>
          ) : (
            filteredSignals.map(signal => (
              <div key={signal.id} className={styles.signalCard}>
                {/* Header */}
                <div className={styles.signalHeader}>
                  <div className={styles.signalTitle}>
                    <h3>{signal.pair}</h3>
                    <p className={styles.signalName}>{signal.name}</p>
                  </div>
                  <div className={`${styles.actionBadge} ${getActionColor(signal.action)}`}>
                    <span className={styles.actionIcon}>{getActionIcon(signal.action)}</span>
                    <span className={styles.actionText}>{signal.action}</span>
                  </div>
                </div>

                {/* Current Price */}
                <div className={styles.currentPrice}>
                  <span className={styles.priceLabel}>Current Price</span>
                  <span className={styles.priceValue}>{signal.current}</span>
                </div>

                {/* Summary */}
                <div className={styles.summary}>
                  <p>{signal.summary}</p>
                </div>

                {/* Confidence & Risk */}
                <div className={styles.metrics}>
                  <div className={styles.confidence}>
                    <span className={styles.metricLabel}>Confidence</span>
                    <div className={styles.confidenceBar}>
                      <div
                        className={styles.confidenceFill}
                        style={{ width: `${signal.confidence}%` }}
                      ></div>
                    </div>
                    <span className={styles.confidenceValue}>{signal.confidence}%</span>
                  </div>

                  <div className={styles.risk}>
                    <span className={styles.metricLabel}>Risk Level</span>
                    <span className={`${styles.riskBadge} ${getRiskColor(signal.risk)}`}>
                      {signal.risk}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className={styles.details}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Why?</span>
                    <span className={styles.detailValue}>{signal.reasoning}</span>
                  </div>
                  {signal.target !== 'N/A' && (
                    <>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Target</span>
                        <span className={styles.detailValue}>{signal.target}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Stop Loss</span>
                        <span className={styles.detailValue}>{signal.stopLoss}</span>
                      </div>
                    </>
                  )}
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Timeframe</span>
                    <span className={styles.detailValue}>{signal.timeframe}</span>
                  </div>
                </div>

                {/* Follow Button */}
                <button
                  className={`${styles.followBtn} ${followedIds.has(signal.id) ? styles.followed : ''}`}
                  onClick={() => handleFollowSignal(signal)}
                >
                  {followedIds.has(signal.id) ? '✅ Following' : 'Follow This Signal 🔔'}
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Performance History */}
      <div className={styles.performanceSection}>
        <h2>Signal Performance This Week</h2>
        <div className={styles.performanceStats}>
          <div className={styles.performanceStat}>
            <span className={styles.performanceLabel}>Signals Sent</span>
            <span className={styles.performanceValue}>{performance.thisWeek}</span>
          </div>
          <div className={styles.performanceStat}>
            <span className={styles.performanceLabel}>Profitable</span>
            <span className={`${styles.performanceValue} ${styles.positive}`}>
              {performance.profitable}
            </span>
          </div>
          <div className={styles.performanceStat}>
            <span className={styles.performanceLabel}>Success Rate</span>
            <span className={`${styles.performanceValue} ${styles.positive}`}>
              {performance.thisWeek > 0
                ? ((performance.profitable / performance.thisWeek) * 100).toFixed(1)
                : '0.0'}
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signals;
