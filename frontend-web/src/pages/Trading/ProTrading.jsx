import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { portfolioAPI } from '../../services/api';
import styles from './ProTrading.module.css';

const PAIRS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT'];
const PAIR_LABELS = {
  BTCUSDT: 'BTC/USDT',
  ETHUSDT: 'ETH/USDT',
  BNBUSDT: 'BNB/USDT',
  SOLUSDT: 'SOL/USDT',
  XRPUSDT: 'XRP/USDT',
  ADAUSDT: 'ADA/USDT',
  DOGEUSDT: 'DOGE/USDT',
};
const USD_SLL = 22500;

const ProTrading = () => {
  const navigate = useNavigate();
  const [pair, setPair] = useState('BTCUSDT');
  const [interval, setInterval] = useState('60');
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [livePrice, setLivePrice] = useState(null);
  const [liveChange, setLiveChange] = useState(0);
  const [balance, setBalance] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    portfolioAPI
      .getStats()
      .then(d => setBalance(d?.total_value || d?.cash_balance_sll || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    wsRef.current?.close();
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${pair.toLowerCase()}@ticker`);
    ws.onmessage = e => {
      const d = JSON.parse(e.data);
      setLivePrice(parseFloat(d.c));
      setLiveChange(parseFloat(d.P));
    };
    wsRef.current = ws;
    return () => ws.close();
  }, [pair]);

  const sllCost = () => {
    if (!amount) return 0;
    const p = orderType === 'market' ? livePrice || 0 : parseFloat(price) || 0;
    return (parseFloat(amount) * p * USD_SLL).toFixed(0);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleTrade = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Enter a valid amount', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await portfolioAPI.executeTrade({
        symbol: PAIR_LABELS[pair],
        action: side.toUpperCase(),
        quantity: parseFloat(amount),
        price: orderType === 'market' ? livePrice : parseFloat(price),
        order_type: orderType,
        stop_loss: stopLoss ? parseFloat(stopLoss) : null,
        take_profit: takeProfit ? parseFloat(takeProfit) : null,
      });
      showToast(`${side.toUpperCase()} order placed! ${amount} ${PAIR_LABELS[pair]}`);
      setAmount('');
      setPrice('');
      setStopLoss('');
      setTakeProfit('');
      portfolioAPI
        .getStats()
        .then(d => setBalance(d?.total_value || d?.cash_balance_sll || 0))
        .catch(() => {});
    } catch (err) {
      showToast(err?.response?.data?.detail || 'Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fmtPrice = p =>
    p ? `$${p.toLocaleString(undefined, { maximumFractionDigits: p > 1 ? 2 : 6 })}` : '—';

  return (
    <div className={styles.terminal}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}>{toast.msg}</div>
      )}

      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <h1 className={styles.termTitle}>⚡ Pro Trading Terminal</h1>
          <div className={styles.pairTabs}>
            {PAIRS.map(p => (
              <button
                key={p}
                className={`${styles.pairTab} ${pair === p ? styles.pairActive : ''}`}
                onClick={() => setPair(p)}
              >
                {PAIR_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.priceBar}>
          <span className={styles.bigPrice}>{fmtPrice(livePrice)}</span>
          <span className={`${styles.bigChange} ${liveChange >= 0 ? styles.up : styles.down}`}>
            {liveChange >= 0 ? '▲' : '▼'} {Math.abs(liveChange).toFixed(2)}%
          </span>
          <span className={styles.sllPrice}>
            ≈ Le {livePrice ? Math.round(livePrice * USD_SLL).toLocaleString() : '—'}
          </span>
          <div className={styles.balanceBadge}>
            <span>Balance:</span>
            <strong>Le {balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className={styles.layout}>
        {/* Chart */}
        <div className={styles.chartSection}>
          <div className={styles.intervalTabs}>
            {[
              ['1', '1m'],
              ['5', '5m'],
              ['15', '15m'],
              ['60', '1H'],
              ['240', '4H'],
              ['D', '1D'],
            ].map(([val, lab]) => (
              <button
                key={val}
                className={`${styles.intTab} ${interval === val ? styles.intActive : ''}`}
                onClick={() => setInterval(val)}
              >
                {lab}
              </button>
            ))}
          </div>
          <iframe
            key={`${pair}-${interval}`}
            src={`https://s.tradingview.com/widgetembed/?symbol=BINANCE%3A${pair}&interval=${interval}&theme=dark&style=1&locale=en&toolbar_bg=050d1a&hide_side_toolbar=0&withdateranges=1&studies=BB@tv-basicstudies,MACD@tv-basicstudies,RSI@tv-basicstudies&overrides={"mainSeriesProperties.candleStyle.upColor":"%2322c55e","mainSeriesProperties.candleStyle.downColor":"%23ef4444","paneProperties.background":"%23050d1a","paneProperties.vertGridProperties.color":"%230a1628","paneProperties.horzGridProperties.color":"%230a1628"}`}
            className={styles.chartFrame}
            title="Trading chart"
            allowFullScreen
          />
        </div>

        {/* Order Panel */}
        <div className={styles.orderPanel}>
          <div className={styles.orderHeader}>
            <h3>Place Order</h3>
            <span className={styles.pairLabel}>{PAIR_LABELS[pair]}</span>
          </div>

          {/* Buy / Sell Toggle */}
          <div className={styles.sideToggle}>
            <button
              className={`${styles.sideBtn} ${side === 'buy' ? styles.sideBuy : ''}`}
              onClick={() => setSide('buy')}
            >
              🟢 BUY
            </button>
            <button
              className={`${styles.sideBtn} ${side === 'sell' ? styles.sideSell : ''}`}
              onClick={() => setSide('sell')}
            >
              🔴 SELL
            </button>
          </div>

          {/* Order Type */}
          <div className={styles.orderTypes}>
            {['market', 'limit', 'stop'].map(t => (
              <button
                key={t}
                className={`${styles.otBtn} ${orderType === t ? styles.otActive : ''}`}
                onClick={() => setOrderType(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Fields */}
          <div className={styles.fields}>
            {orderType !== 'market' && (
              <div className={styles.field}>
                <label>{orderType === 'stop' ? 'Stop Price' : 'Limit Price'} (USD)</label>
                <input
                  className={styles.input}
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder={`e.g. ${livePrice?.toFixed(2) || '—'}`}
                />
              </div>
            )}
            <div className={styles.field}>
              <label>Amount ({PAIR_LABELS[pair].split('/')[0]})</label>
              <input
                className={styles.input}
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.001"
                step="0.0001"
              />
              {amount && (
                <small className={styles.hint}>≈ Le {parseFloat(sllCost()).toLocaleString()}</small>
              )}
            </div>
            <div className={styles.field}>
              <label>
                Stop Loss (USD) <span className={styles.optional}>optional</span>
              </label>
              <input
                className={styles.input}
                type="number"
                value={stopLoss}
                onChange={e => setStopLoss(e.target.value)}
                placeholder="Auto-calculated"
              />
            </div>
            <div className={styles.field}>
              <label>
                Take Profit (USD) <span className={styles.optional}>optional</span>
              </label>
              <input
                className={styles.input}
                type="number"
                value={takeProfit}
                onChange={e => setTakeProfit(e.target.value)}
                placeholder="Auto-calculated"
              />
            </div>
          </div>

          {/* Summary */}
          <div className={styles.orderSummary}>
            <div className={styles.summRow}>
              <span>Market Price</span>
              <strong>{fmtPrice(livePrice)}</strong>
            </div>
            <div className={styles.summRow}>
              <span>Quantity</span>
              <strong>
                {amount || '0'} {PAIR_LABELS[pair].split('/')[0]}
              </strong>
            </div>
            <div className={styles.summRow}>
              <span>Est. Total</span>
              <strong className={styles.goldText}>
                Le {parseFloat(sllCost() || 0).toLocaleString()}
              </strong>
            </div>
          </div>

          {/* Submit */}
          <button
            className={`${styles.submitBtn} ${side === 'buy' ? styles.submitBuy : styles.submitSell}`}
            onClick={handleTrade}
            disabled={submitting}
          >
            {submitting
              ? '⏳ Placing...'
              : `${side === 'buy' ? '🟢 BUY' : '🔴 SELL'} ${PAIR_LABELS[pair]}`}
          </button>

          {/* Quick links */}
          <div className={styles.quickLinks}>
            <button onClick={() => navigate('/signals')}>⚡ View AI Signals</button>
            <button onClick={() => navigate('/portfolio')}>💰 My Portfolio</button>
          </div>

          {/* Disclaimer */}
          <p className={styles.disclaimer}>
            Trading involves risk. Only invest what you can afford to lose.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProTrading;
