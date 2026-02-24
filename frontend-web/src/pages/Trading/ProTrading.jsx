import React, { useState, useEffect, useRef, useCallback } from 'react';
import { portfolioAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ProTrading.module.css';

const SYMBOLS = [
  { value: 'BTC/USD', label: 'Bitcoin', tv: 'BINANCE:BTCUSDT' },
  { value: 'ETH/USD', label: 'Ethereum', tv: 'BINANCE:ETHUSDT' },
  { value: 'SOL/USD', label: 'Solana', tv: 'BINANCE:SOLUSDT' },
  { value: 'BNB/USD', label: 'BNB', tv: 'BINANCE:BNBUSDT' },
  { value: 'XRP/USD', label: 'XRP', tv: 'BINANCE:XRPUSDT' },
  { value: 'ADA/USD', label: 'Cardano', tv: 'BINANCE:ADAUSDT' },
];

const TOP_TRADERS = [
  { name: 'Amara K.', profit: '+42.3%', trades: 312, win: '68%', country: '🇸🇱', subscribers: 1240 },
  {
    name: 'Ibrahim S.',
    profit: '+31.7%',
    trades: 201,
    win: '61%',
    country: '🇸🇱',
    subscribers: 870,
  },
  { name: 'Fatima D.', profit: '+28.5%', trades: 156, win: '59%', country: '🌍', subscribers: 640 },
  { name: 'Mohamed J.', profit: '+19.2%', trades: 98, win: '55%', country: '🇸🇱', subscribers: 420 },
];

const ORDER_BOOK_MOCK = {
  asks: [
    { price: '54,820', size: '0.4210', total: '23,079' },
    { price: '54,790', size: '0.8850', total: '48,489' },
    { price: '54,760', size: '1.2200', total: '66,808' },
    { price: '54,730', size: '0.3100', total: '16,966' },
    { price: '54,700', size: '2.0050', total: '109,673' },
  ],
  bids: [
    { price: '54,680', size: '1.5100', total: '82,566' },
    { price: '54,650', size: '0.6700', total: '36,615' },
    { price: '54,620', size: '2.2300', total: '121,803' },
    { price: '54,590', size: '0.9800', total: '53,498' },
    { price: '54,550', size: '1.8400', total: '100,372' },
  ],
};

const ProTrading = () => {
  const { user } = useAuth();
  const [symbol, setSymbol] = useState(SYMBOLS[0]);
  const [ticker, setTicker] = useState(null);
  const [orderBook, setOrderBook] = useState(ORDER_BOOK_MOCK);
  const [side, setSide] = useState('BUY');
  const [orderType, setOrderType] = useState('MARKET');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [confirm, setConfirm] = useState(null); // {type, qty, total}
  const [toast, setToast] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);
  const container = useRef();

  /* ── TradingView chart ─────────────────────────────────────────── */
  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol.tv,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      allow_symbol_change: false,
      support_host: 'https://www.tradingview.com',
    });
    container.current.appendChild(script);
  }, [symbol]);

  /* ── Live ticker polling ───────────────────────────────────────── */
  const fetchTicker = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.value.replace('/', '')}T`
      );
      if (!res.ok) return;
      const d = await res.json();
      setTicker({
        price: parseFloat(d.lastPrice),
        change: parseFloat(d.priceChangePercent),
        high: parseFloat(d.highPrice),
        low: parseFloat(d.lowPrice),
        vol: parseFloat(d.volume),
      });
    } catch {
      // Binance unreachable — keep previous ticker
    }
  }, [symbol]);

  useEffect(() => {
    fetchTicker();
    const id = setInterval(fetchTicker, 5000);
    return () => clearInterval(id);
  }, [fetchTicker]);

  /* ── Place order ────────────────────────────────────────────────── */
  const handleOrder = () => {
    if (!quantity || isNaN(quantity) || parseFloat(quantity) <= 0) {
      showToast('Enter a valid quantity', 'error');
      return;
    }
    const px = orderType === 'MARKET' ? ticker?.price || 54680 : parseFloat(price);
    const total = parseFloat(quantity) * px;
    setConfirm({ side, qty: quantity, px, total });
  };

  const confirmOrder = async () => {
    try {
      await portfolioAPI.executeTrade({
        symbol: symbol.value,
        action: confirm.side,
        quantity: parseFloat(confirm.qty),
        price: confirm.px,
        order_type: orderType,
      });
      showToast(`✅ ${confirm.side} ${confirm.qty} ${symbol.label} executed!`, 'success');
    } catch (e) {
      showToast(e.response?.data?.detail || 'Trade failed — check your balance', 'error');
    }
    setConfirm(null);
    setQuantity('');
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCopy = trader => {
    setCopySuccess(trader.name);
    showToast(`Now copying ${trader.name}!`, 'success');
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const changePercent = ticker?.change ?? 0;
  const priceDisplay = ticker?.price?.toLocaleString('en-US', { minimumFractionDigits: 2 }) ?? '—';
  const sllPrice = ticker
    ? (ticker.price * 23.7).toLocaleString('en-US', { maximumFractionDigits: 0 })
    : '—';

  return (
    <div className={styles.page}>
      {/* ── Top Bar ─────────────────────────────────────────────── */}
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <span className={styles.terminalLabel}>⚡ Advanced Terminal</span>
          <select
            className={styles.symbolSelect}
            value={symbol.value}
            onChange={e => setSymbol(SYMBOLS.find(s => s.value === e.target.value))}
          >
            {SYMBOLS.map(s => (
              <option key={s.value} value={s.value}>
                {s.value} — {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.tickerRow}>
          <span className={styles.tickerPrice}>${priceDisplay}</span>
          <span
            className={`${styles.tickerChange} ${changePercent >= 0 ? styles.green : styles.red}`}
          >
            {changePercent >= 0 ? '▲' : '▼'} {Math.abs(changePercent).toFixed(2)}%
          </span>
          <span className={styles.tickerSll}>≈ Le {sllPrice}</span>
          {ticker && (
            <>
              <span className={styles.tickerStat}>H: ${ticker.high.toLocaleString()}</span>
              <span className={styles.tickerStat}>L: ${ticker.low.toLocaleString()}</span>
              <span className={styles.tickerStat}>Vol: {ticker.vol.toFixed(1)}</span>
            </>
          )}
        </div>
      </div>

      {/* ── Main Grid ───────────────────────────────────────────── */}
      <div className={styles.mainGrid}>
        {/* Order Book */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>📋 Order Book</h3>
          <div className={styles.obHeader}>
            <span>Price</span>
            <span>Size</span>
            <span>Total</span>
          </div>
          <div className={styles.asks}>
            {orderBook.asks.map((a, i) => (
              <div key={i} className={styles.obRow}>
                <span className={styles.askPrice}>{a.price}</span>
                <span>{a.size}</span>
                <span className={styles.obTotal}>{a.total}</span>
              </div>
            ))}
          </div>
          <div className={styles.spread}>
            Spread: <span>${(((54820 - 54680) / 54750) * 100).toFixed(3)}%</span>
          </div>
          <div className={styles.bids}>
            {orderBook.bids.map((b, i) => (
              <div key={i} className={styles.obRow}>
                <span className={styles.bidPrice}>{b.price}</span>
                <span>{b.size}</span>
                <span className={styles.obTotal}>{b.total}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className={styles.chartPanel}>
          <div ref={container} className={styles.chartContainer} />
        </div>

        {/* Order Entry */}
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>⚡ Speed Trade</h3>

          {/* Buy / Sell toggle */}
          <div className={styles.sideToggle}>
            <button
              className={`${styles.sideBtn} ${side === 'BUY' ? styles.buyActive : ''}`}
              onClick={() => setSide('BUY')}
            >
              BUY
            </button>
            <button
              className={`${styles.sideBtn} ${side === 'SELL' ? styles.sellActive : ''}`}
              onClick={() => setSide('SELL')}
            >
              SELL
            </button>
          </div>

          {/* Order type */}
          <div className={styles.orderTypeRow}>
            {['MARKET', 'LIMIT'].map(t => (
              <button
                key={t}
                className={`${styles.typeBtn} ${orderType === t ? styles.typeActive : ''}`}
                onClick={() => setOrderType(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <label className={styles.fieldLabel}>Quantity ({symbol.value.split('/')[0]})</label>
          <input
            type="number"
            className={styles.tradeInput}
            placeholder="0.00100"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            min="0"
            step="0.00001"
          />

          {orderType === 'LIMIT' && (
            <>
              <label className={styles.fieldLabel}>Limit Price (USD)</label>
              <input
                type="number"
                className={styles.tradeInput}
                placeholder={ticker?.price?.toFixed(2) ?? '54680'}
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </>
          )}

          {quantity && ticker && (
            <div className={styles.orderSummary}>
              Est. Total:{' '}
              <strong>
                $
                {(
                  parseFloat(quantity || 0) *
                  (orderType === 'LIMIT' && price ? parseFloat(price) : (ticker?.price ?? 0))
                ).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </strong>
            </div>
          )}

          <button
            className={`${styles.executeBtn} ${side === 'BUY' ? styles.executeBuy : styles.executeSell}`}
            onClick={handleOrder}
          >
            {side === 'BUY' ? '🟢 BUY' : '🔴 SELL'} {symbol.value.split('/')[0]}
          </button>

          <div className={styles.balanceHint}>
            Balance: Le{' '}
            {user?.balance_sll?.toLocaleString('en-US', { maximumFractionDigits: 0 }) ?? '0'}
          </div>
        </div>
      </div>

      {/* ── Copy Trading ─────────────────────────────────────────── */}
      <div className={styles.copySection}>
        <h2 className={styles.sectionTitle}>👥 Top Traders to Copy</h2>
        <div className={styles.traderGrid}>
          {TOP_TRADERS.map(t => (
            <div key={t.name} className={styles.traderCard}>
              <div className={styles.traderTop}>
                <span className={styles.traderFlag}>{t.country}</span>
                <strong className={styles.traderName}>{t.name}</strong>
              </div>
              <div className={styles.traderStats}>
                <div className={styles.traderStat}>
                  <span className={styles.statLabel}>Profit</span>
                  <span className={styles.traderProfit}>{t.profit}</span>
                </div>
                <div className={styles.traderStat}>
                  <span className={styles.statLabel}>Win Rate</span>
                  <span>{t.win}</span>
                </div>
                <div className={styles.traderStat}>
                  <span className={styles.statLabel}>Trades</span>
                  <span>{t.trades}</span>
                </div>
                <div className={styles.traderStat}>
                  <span className={styles.statLabel}>Followers</span>
                  <span>{t.subscribers.toLocaleString()}</span>
                </div>
              </div>
              <button
                className={`${styles.copyBtn} ${copySuccess === t.name ? styles.copied : ''}`}
                onClick={() => handleCopy(t)}
              >
                {copySuccess === t.name ? '✅ Copying!' : '📋 Copy Trader'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Confirm Modal ─────────────────────────────────────────── */}
      {confirm && (
        <div className={styles.overlay} onClick={() => setConfirm(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>Confirm {confirm.side} Order</h3>
            <div className={styles.confirmGrid}>
              <span>Symbol</span>
              <strong>{symbol.value}</strong>
              <span>Side</span>
              <strong className={confirm.side === 'BUY' ? styles.green : styles.red}>
                {confirm.side}
              </strong>
              <span>Quantity</span>
              <strong>
                {confirm.qty} {symbol.value.split('/')[0]}
              </strong>
              <span>Price</span>
              <strong>${confirm.px.toLocaleString()}</strong>
              <span>Est. Total</span>
              <strong>
                ${confirm.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </strong>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setConfirm(null)}>
                Cancel
              </button>
              <button
                className={`${styles.confirmBtn} ${confirm.side === 'BUY' ? styles.confirmBuy : styles.confirmSell}`}
                onClick={confirmOrder}
              >
                Confirm {confirm.side}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ─────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : styles.toastSuccess}`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ProTrading;
