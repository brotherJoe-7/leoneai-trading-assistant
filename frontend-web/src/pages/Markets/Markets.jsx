import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Markets.module.css';

// All markets to show — fetched from Binance API
const MARKET_LIST = [
  {
    symbol: 'BTCUSDT',
    pair: 'BTC/USDT',
    name: 'Bitcoin',
    category: 'crypto',
    icon: '₿',
    color: '#f7931a',
  },
  {
    symbol: 'ETHUSDT',
    pair: 'ETH/USDT',
    name: 'Ethereum',
    category: 'crypto',
    icon: 'Ξ',
    color: '#627eea',
  },
  {
    symbol: 'BNBUSDT',
    pair: 'BNB/USDT',
    name: 'BNB',
    category: 'crypto',
    icon: '◆',
    color: '#f3ba2f',
  },
  {
    symbol: 'SOLUSDT',
    pair: 'SOL/USDT',
    name: 'Solana',
    category: 'crypto',
    icon: '◎',
    color: '#9945ff',
  },
  {
    symbol: 'XRPUSDT',
    pair: 'XRP/USDT',
    name: 'Ripple',
    category: 'crypto',
    icon: 'X',
    color: '#00aae4',
  },
  {
    symbol: 'ADAUSDT',
    pair: 'ADA/USDT',
    name: 'Cardano',
    category: 'crypto',
    icon: '₳',
    color: '#0033ad',
  },
  {
    symbol: 'DOGEUSDT',
    pair: 'DOGE/USDT',
    name: 'Dogecoin',
    category: 'crypto',
    icon: 'Ð',
    color: '#c2a633',
  },
  {
    symbol: 'AVAXUSDT',
    pair: 'AVAX/USDT',
    name: 'Avalanche',
    category: 'crypto',
    icon: '🔺',
    color: '#e84142',
  },
  {
    symbol: 'DOTUSDT',
    pair: 'DOT/USDT',
    name: 'Polkadot',
    category: 'crypto',
    icon: '●',
    color: '#e6007a',
  },
  {
    symbol: 'MATICUSDT',
    pair: 'MATIC/USDT',
    name: 'Polygon',
    category: 'crypto',
    icon: 'P',
    color: '#8247e5',
  },
];

// SLL forex pairs (static approximations, updated periodically)
const FOREX_SLL = [
  {
    symbol: 'USDSLL',
    pair: 'USD/SLL',
    name: 'US Dollar',
    category: 'forex',
    icon: '$',
    color: '#22c55e',
    price: 22500,
    change: 0.12,
    volume: '12.5M',
  },
  {
    symbol: 'GBPSLL',
    pair: 'GBP/SLL',
    name: 'British Pound',
    category: 'forex',
    icon: '£',
    color: '#d4a832',
    price: 28600,
    change: -0.08,
    volume: '4.2M',
  },
  {
    symbol: 'EURSLL',
    pair: 'EUR/SLL',
    name: 'Euro',
    category: 'forex',
    icon: '€',
    color: '#627eea',
    price: 24350,
    change: 0.05,
    volume: '7.8M',
  },
  {
    symbol: 'XOFSLL',
    pair: 'XOF/SLL',
    name: 'CFA Franc',
    category: 'forex',
    icon: '₣',
    color: '#14b8a6',
    price: 38.5,
    change: -0.02,
    volume: '2.1M',
  },
];

const USD_SLL = 22500;

const Markets = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState({});
  const [changes, setChanges] = useState({});
  const [volumes, setVolumes] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortDir, setSortDir] = useState(1); // 1 = asc, -1 = desc
  const [selected, setSelected] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    fetchInitial();
    connectWS();
    return () => wsRef.current?.close();
  }, []);

  const fetchInitial = async () => {
    try {
      const syms = MARKET_LIST.map(m => `"${m.symbol}"`).join(',');
      const r = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=[${syms}]`);
      const data = await r.json();
      const p = {},
        c = {},
        v = {};
      data.forEach(d => {
        p[d.symbol] = parseFloat(d.lastPrice);
        c[d.symbol] = parseFloat(d.priceChangePercent);
        v[d.symbol] = parseFloat(d.volume);
      });
      setPrices(p);
      setChanges(c);
      setVolumes(v);
    } catch (_) {}
    setLoading(false);
  };

  const connectWS = () => {
    try {
      const streams = MARKET_LIST.map(m => `${m.symbol.toLowerCase()}@ticker`).join('/');
      wsRef.current = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
      wsRef.current.onmessage = e => {
        const { data } = JSON.parse(e.data);
        if (!data) return;
        setPrices(p => ({ ...p, [data.s]: parseFloat(data.c) }));
        setChanges(p => ({ ...p, [data.s]: parseFloat(data.P) }));
        setVolumes(p => ({ ...p, [data.s]: parseFloat(data.v) }));
      };
      wsRef.current.onerror = () => wsRef.current?.close();
      wsRef.current.onclose = () => setTimeout(connectWS, 4000);
    } catch (_) {}
  };

  const handleSort = col => {
    if (sortBy === col) setSortDir(d => -d);
    else {
      setSortBy(col);
      setSortDir(1);
    }
  };

  const allMarkets = [
    ...MARKET_LIST.map(m => ({
      ...m,
      price: prices[m.symbol],
      priceSLL: prices[m.symbol] ? prices[m.symbol] * USD_SLL : null,
      change: changes[m.symbol] ?? 0,
      volume: volumes[m.symbol] ? (volumes[m.symbol] * (prices[m.symbol] || 1)).toFixed(0) : null,
    })),
    ...FOREX_SLL,
  ];

  const filtered = allMarkets
    .filter(m => {
      if (category !== 'all' && m.category !== category) return false;
      if (
        search &&
        !m.name.toLowerCase().includes(search.toLowerCase()) &&
        !m.pair.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'change') return sortDir * ((a.change ?? 0) - (b.change ?? 0));
      if (sortBy === 'price')
        return sortDir * ((a.price ?? a.price ?? 0) - (b.price ?? b.price ?? 0));
      return sortDir * a.name.localeCompare(b.name);
    });

  const fmtPrice = m => {
    if (m.category === 'forex') return `Le ${m.price?.toLocaleString() ?? '—'}`;
    if (m.price)
      return `$${m.price.toLocaleString(undefined, { maximumFractionDigits: m.price > 1 ? 2 : 6 })}`;
    return '—';
  };

  const fmtSLL = m => {
    if (m.category === 'forex') return `Le ${m.price?.toLocaleString() ?? '—'}`;
    if (m.priceSLL) return `Le ${(m.priceSLL / 1e6).toFixed(2)}M`;
    return '—';
  };

  const fmtVol = m => {
    if (m.volume) {
      const n = typeof m.volume === 'number' ? m.volume : parseFloat(m.volume);
      if (n > 1e9) return `$${(n / 1e9).toFixed(1)}B`;
      if (n > 1e6) return `$${(n / 1e6).toFixed(1)}M`;
      return `$${(n / 1e3).toFixed(0)}K`;
    }
    return m.volume ?? '—';
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>📈 Live Markets</h1>
          <p className={styles.subtitle}>Real-time prices from Binance · Updated every second</p>
        </div>
        <div className={styles.liveChip}>
          <span className={styles.liveDot} />
          LIVE
        </div>
      </div>

      {/* Summary strip */}
      <div className={styles.summaryStrip}>
        {[
          {
            label: 'BTC/USDT',
            val: prices['BTCUSDT']
              ? `$${prices['BTCUSDT'].toLocaleString(undefined, { maximumFractionDigits: 2 })}`
              : '—',
            chg: changes['BTCUSDT'],
          },
          {
            label: 'ETH/USDT',
            val: prices['ETHUSDT']
              ? `$${prices['ETHUSDT'].toLocaleString(undefined, { maximumFractionDigits: 2 })}`
              : '—',
            chg: changes['ETHUSDT'],
          },
          { label: 'USD/SLL', val: `Le 22,500`, chg: 0.12 },
          { label: 'Market Pairs', val: `${filtered.length}`, chg: null },
        ].map((s, i) => (
          <div key={i} className={styles.summaryCard}>
            <span className={styles.summaryLabel}>{s.label}</span>
            <span className={styles.summaryVal}>{s.val}</span>
            {s.chg !== null && (
              <span className={`${styles.summaryChg} ${s.chg >= 0 ? styles.up : styles.down}`}>
                {s.chg >= 0 ? '+' : ''}
                {s.chg?.toFixed(2)}%
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <input
          className={styles.search}
          placeholder="🔍 Search by name or pair..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.catTabs}>
          {['all', 'crypto', 'forex'].map(c => (
            <button
              key={c}
              className={`${styles.catTab} ${category === c ? styles.catActive : ''}`}
              onClick={() => setCategory(c)}
            >
              {c === 'all' ? 'All Markets' : c === 'crypto' ? '₿ Crypto' : '💱 Forex'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th onClick={() => handleSort('name')} className={styles.sortable}>
                Asset {sortBy === 'name' ? (sortDir === 1 ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('price')} className={styles.sortable}>
                Price (USD) {sortBy === 'price' ? (sortDir === 1 ? '↑' : '↓') : ''}
              </th>
              <th>Price (SLL)</th>
              <th onClick={() => handleSort('change')} className={styles.sortable}>
                24h Change {sortBy === 'change' ? (sortDir === 1 ? '↑' : '↓') : ''}
              </th>
              <th>Volume (24h)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className={styles.loadingRow}>
                  <div className={styles.spinner} />
                  Loading markets...
                </td>
              </tr>
            ) : (
              filtered.map((m, i) => (
                <tr
                  key={m.symbol}
                  className={`${styles.row} ${selected === m.symbol ? styles.rowSelected : ''}`}
                  onClick={() => setSelected(selected === m.symbol ? null : m.symbol)}
                >
                  <td className={styles.num}>{i + 1}</td>
                  <td>
                    <div className={styles.assetCell}>
                      <span className={styles.assetIcon} style={{ color: m.color }}>
                        {m.icon}
                      </span>
                      <div>
                        <div className={styles.assetName}>{m.name}</div>
                        <div className={styles.assetPair}>{m.pair}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.priceCell}>{fmtPrice(m)}</td>
                  <td className={styles.sllCell}>{fmtSLL(m)}</td>
                  <td>
                    <span
                      className={`${styles.changeCell} ${(m.change ?? 0) >= 0 ? styles.up : styles.down}`}
                    >
                      {(m.change ?? 0) >= 0 ? '▲' : '▼'} {Math.abs(m.change ?? 0).toFixed(2)}%
                    </span>
                  </td>
                  <td className={styles.volCell}>{fmtVol(m)}</td>
                  <td>
                    <button
                      className={styles.tradeBtn}
                      onClick={e => {
                        e.stopPropagation();
                        navigate('/trading');
                      }}
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mini chart panel when row selected */}
      {selected &&
        (() => {
          const m = filtered.find(x => x.symbol === selected);
          if (!m) return null;
          return (
            <div className={styles.miniChart}>
              <div className={styles.miniChartHeader}>
                <span style={{ color: m.color, fontWeight: 800 }}>{m.icon}</span>
                <span className={styles.miniChartTitle}>{m.pair} — TradingView Chart</span>
                <button className={styles.closeChart} onClick={() => setSelected(null)}>
                  ✕
                </button>
              </div>
              <iframe
                src={`https://s.tradingview.com/widgetembed/?symbol=BINANCE%3A${m.symbol}&interval=60&theme=dark&style=1&locale=en&toolbar_bg=0a1628&hide_side_toolbar=true`}
                className={styles.chartFrame}
                title={`${m.pair} chart`}
                allowFullScreen
              />
              <div className={styles.miniButtons}>
                <button className={styles.buyBtn} onClick={() => navigate('/trading')}>
                  🟢 BUY {m.pair}
                </button>
                <button className={styles.sellBtn} onClick={() => navigate('/trading')}>
                  🔴 SELL {m.pair}
                </button>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default Markets;
