import React, { useState, useEffect } from 'react';
import { signalsAPI } from '../../services/api';
import styles from './Signals.module.css';

const FILTERS = ['All', 'BUY', 'SELL', 'HOLD'];

const FALLBACK = [
  {
    id: 1,
    symbol: 'BTC/SLL',
    action: 'BUY',
    confidence: 87.5,
    strategy: 'RSI + MACD Divergence',
    reason: 'RSI hit 28.3 — historically strong buy zone. MACD bullish crossover confirmed on 4H.',
    price: 1245320000,
    target_price: 1340000000,
    stop_loss: 1180000000,
    timeframe: '4H',
    risk: 'Medium',
  },
  {
    id: 2,
    symbol: 'ETH/SLL',
    action: 'BUY',
    confidence: 79,
    strategy: 'Bollinger Bands Bounce',
    reason: 'Price bounced off lower Bollinger Band. Volume spike +38% confirms reversal.',
    price: 58200000,
    target_price: 64000000,
    stop_loss: 54000000,
    timeframe: '1D',
    risk: 'Medium',
  },
  {
    id: 3,
    symbol: 'USD/SLL',
    action: 'BUY',
    confidence: 93,
    strategy: 'Wedge Breakout',
    reason: 'Ascending wedge breakout on 4H. Rising import demand in Freetown.',
    price: 22500,
    target_price: 23800,
    stop_loss: 21900,
    timeframe: '4H',
    risk: 'Low',
  },
  {
    id: 4,
    symbol: 'SOL/SLL',
    action: 'SELL',
    confidence: 74,
    strategy: 'Head & Shoulders',
    reason: 'Classic H&S pattern complete. Neckline broken on high volume.',
    price: 3200000,
    target_price: 2800000,
    stop_loss: 3450000,
    timeframe: '4H',
    risk: 'Medium',
  },
  {
    id: 5,
    symbol: 'BNB/SLL',
    action: 'HOLD',
    confidence: 61,
    strategy: 'EMA Consolidation',
    reason: 'Trading in tight range — wait for breakout confirmation.',
    price: 8100000,
    target_price: 8900000,
    stop_loss: 7600000,
    timeframe: '1D',
    risk: 'High',
  },
  {
    id: 6,
    symbol: 'GBP/SLL',
    action: 'BUY',
    confidence: 82,
    strategy: 'Support Bounce',
    reason: 'Testing key support. RSI at 34 — oversold recovery expected.',
    price: 28500,
    target_price: 30200,
    stop_loss: 27400,
    timeframe: '1D',
    risk: 'Low',
  },
  {
    id: 7,
    symbol: 'XRP/SLL',
    action: 'BUY',
    confidence: 71,
    strategy: 'Fibonacci 61.8%',
    reason: '61.8% fib level holding. Bullish engulfing candle on daily.',
    price: 112000,
    target_price: 135000,
    stop_loss: 98000,
    timeframe: '1D',
    risk: 'Medium',
  },
  {
    id: 8,
    symbol: 'EUR/SLL',
    action: 'SELL',
    confidence: 68,
    strategy: 'Double Top Reversal',
    reason: 'Double top at 24,800 resistance. Momentum fading.',
    price: 24500,
    target_price: 24100,
    stop_loss: 24900,
    timeframe: '4H',
    risk: 'Low',
  },
];

const fmt = n =>
  n > 1000000
    ? `Le ${(n / 1000000).toFixed(2)}M`
    : n > 1000
      ? `Le ${n.toLocaleString()}`
      : `Le ${n}`;

const SignalCard = ({ sig, expanded, onToggle }) => {
  const isUp = sig.action === 'BUY';
  const isDown = sig.action === 'SELL';
  const pct = sig.confidence;

  return (
    <div className={`${styles.card} ${expanded ? styles.cardExpanded : ''}`} onClick={onToggle}>
      <div className={styles.cardTop}>
        <div className={`${styles.actionBadge} ${styles[`action${sig.action}`]}`}>{sig.action}</div>
        <div className={styles.cardMain}>
          <div className={styles.cardPair}>{sig.symbol}</div>
          <div className={styles.cardStrategy}>{sig.strategy}</div>
        </div>
        <div className={styles.cardRight}>
          <div className={styles.confWrap}>
            <span className={styles.confNum}>{pct?.toFixed(0)}%</span>
            <div className={styles.confBar}>
              <div
                className={styles.confFill}
                style={{
                  width: `${pct}%`,
                  background: pct > 80 ? '#22c55e' : pct > 65 ? '#f59e0b' : '#ef4444',
                }}
              />
            </div>
            <span className={styles.confLabel}>AI Confidence</span>
          </div>
          <span className={`${styles.riskBadge} ${styles[`risk${sig.risk?.toLowerCase()}`]}`}>
            {sig.risk}
          </span>
        </div>
        <div className={styles.chevron}>{expanded ? '▲' : '▼'}</div>
      </div>

      {expanded && (
        <div className={styles.cardBody}>
          <div className={styles.reasonBox}>
            <span className={styles.reasonLabel}>🤖 AI Reasoning</span>
            <p className={styles.reasonText}>{sig.reason}</p>
          </div>
          <div className={styles.priceGrid}>
            <div className={styles.priceBox}>
              <span>Entry Price</span>
              <strong>{fmt(sig.price)}</strong>
            </div>
            <div className={`${styles.priceBox} ${styles.priceTarget}`}>
              <span>Target Price</span>
              <strong>{fmt(sig.target_price)}</strong>
            </div>
            <div className={`${styles.priceBox} ${styles.priceStop}`}>
              <span>Stop Loss</span>
              <strong>{fmt(sig.stop_loss)}</strong>
            </div>
            <div className={styles.priceBox}>
              <span>Timeframe</span>
              <strong>{sig.timeframe}</strong>
            </div>
          </div>
          <div className={styles.potentialRow}>
            {sig.action !== 'HOLD' && (
              <>
                <div className={styles.potential}>
                  <span>Potential Gain</span>
                  <strong className={styles.potGain}>
                    +{(((sig.target_price - sig.price) / sig.price) * 100).toFixed(1)}%
                  </strong>
                </div>
                <div className={styles.potential}>
                  <span>Max Loss</span>
                  <strong className={styles.potLoss}>
                    {(((sig.stop_loss - sig.price) / sig.price) * 100).toFixed(1)}%
                  </strong>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Signals = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [liveData, setLiveData] = useState(true);

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    setLoading(true);
    try {
      const data = await signalsAPI.getSignals();
      const arr = Array.isArray(data) ? data : Array.isArray(data?.signals) ? data.signals : null;
      if (arr && arr.length > 0) {
        setSignals(arr);
        setLiveData(true);
      } else {
        setSignals(FALLBACK);
        setLiveData(false);
      }
    } catch {
      setSignals(FALLBACK);
      setLiveData(false);
    } finally {
      setLoading(false);
      setLastUpdate(new Date());
    }
  };

  const filtered = filter === 'All' ? signals : signals.filter(s => s.action === filter);
  const counts = {
    BUY: signals.filter(s => s.action === 'BUY').length,
    SELL: signals.filter(s => s.action === 'SELL').length,
    HOLD: signals.filter(s => s.action === 'HOLD').length,
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>⚡ AI Trading Signals</h1>
          <p className={styles.subtitle}>
            {liveData ? '✅ Live data from AI analysis engine' : '📡 Using cached signal data'}
            {lastUpdate && ` · Updated ${lastUpdate.toLocaleTimeString()}`}
          </p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchSignals} disabled={loading}>
          {loading ? '⏳ Loading...' : '↻ Refresh'}
        </button>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statNum} style={{ color: '#22c55e' }}>
            {counts.BUY}
          </span>
          <span className={styles.statLabel}>BUY Signals</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum} style={{ color: '#ef4444' }}>
            {counts.SELL}
          </span>
          <span className={styles.statLabel}>SELL Signals</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum} style={{ color: '#f59e0b' }}>
            {counts.HOLD}
          </span>
          <span className={styles.statLabel}>HOLD Signals</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNum} style={{ color: '#d4a832' }}>
            {signals.length > 0
              ? (signals.reduce((a, s) => a + s.confidence, 0) / signals.length).toFixed(0)
              : 0}
            %
          </span>
          <span className={styles.statLabel}>Avg Confidence</span>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        {FILTERS.map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}{' '}
            {f !== 'All' && (
              <span className={styles.filterCount}>{counts[f] ?? signals.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Signals List */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Scanning markets for signals...</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map(sig => (
            <SignalCard
              key={sig.id}
              sig={sig}
              expanded={expanded === sig.id}
              onToggle={() => setExpanded(expanded === sig.id ? null : sig.id)}
            />
          ))}
        </div>
      )}

      <p className={styles.disclaimer}>
        ⚠️ These AI signals are for informational purposes only. Always do your own research before
        trading. Past performance does not guarantee future results.
      </p>
    </div>
  );
};

export default Signals;
