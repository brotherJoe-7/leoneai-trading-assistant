import React, { useState, useEffect, useRef } from 'react';
import styles from './MarketTicker.module.css';

const COINS = [
  { symbol: 'BTC/USDT', id: 'BTCUSDT', color: '#f7931a' },
  { symbol: 'ETH/USDT', id: 'ETHUSDT', color: '#627eea' },
  { symbol: 'BNB/USDT', id: 'BNBUSDT', color: '#f3ba2f' },
  { symbol: 'SOL/USDT', id: 'SOLUSDT', color: '#9945ff' },
  { symbol: 'XRP/USDT', id: 'XRPUSDT', color: '#00aae4' },
  { symbol: 'ADA/USDT', id: 'ADAUSDT', color: '#0033ad' },
  { symbol: 'DOGE/USDT', id: 'DOGEUSDT', color: '#c2a633' },
  { symbol: 'AVAX/USDT', id: 'AVAXUSDT', color: '#e84142' },
];

const MarketTicker = () => {
  const [prices, setPrices] = useState({});
  const [changes, setChanges] = useState({});
  const wsRef = useRef(null);
  const prevPrices = useRef({});

  useEffect(() => {
    const streams = COINS.map(c => `${c.id.toLowerCase()}@ticker`).join('/');
    const connect = () => {
      try {
        wsRef.current = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
        wsRef.current.onmessage = e => {
          const { data } = JSON.parse(e.data);
          if (!data) return;
          const sym = data.s;
          const price = parseFloat(data.c);
          const pct = parseFloat(data.P);
          setPrices(p => ({ ...p, [sym]: price }));
          setChanges(p => ({ ...p, [sym]: pct }));
          prevPrices.current[sym] = price;
        };
        wsRef.current.onerror = () => wsRef.current?.close();
        wsRef.current.onclose = () => setTimeout(connect, 3000);
      } catch (_) {
        /* fallback to polling */
      }
    };

    connect();
    // Fallback: fetch via REST if WS fails
    const fetchFallback = async () => {
      try {
        const symbols = COINS.map(c => `"${c.id}"`).join(',');
        const r = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbols=[${symbols}]`);
        const data = await r.json();
        const p = {},
          c = {};
        data.forEach(d => {
          p[d.symbol] = parseFloat(d.lastPrice);
          c[d.symbol] = parseFloat(d.priceChangePercent);
        });
        setPrices(p);
        setChanges(c);
      } catch (_) {}
    };
    fetchFallback();

    return () => wsRef.current?.close();
  }, []);

  const items = [...COINS, ...COINS]; // duplicate for seamless loop

  return (
    <div className={styles.ticker}>
      <div className={styles.label}>LIVE</div>
      <div className={styles.track}>
        <div className={styles.scroll}>
          {items.map((coin, i) => {
            const price = prices[coin.id];
            const pct = changes[coin.id] ?? 0;
            const up = pct >= 0;
            return (
              <div key={`${coin.id}-${i}`} className={styles.item}>
                <span className={styles.coinDot} style={{ background: coin.color }} />
                <span className={styles.sym}>{coin.symbol}</span>
                <span className={styles.price}>
                  {price
                    ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: price > 100 ? 2 : 4 })}`
                    : '---'}
                </span>
                <span className={`${styles.pct} ${up ? styles.up : styles.down}`}>
                  {pct !== 0 ? `${up ? '+' : ''}${pct.toFixed(2)}%` : ''}
                </span>
                <span className={styles.divider} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketTicker;
