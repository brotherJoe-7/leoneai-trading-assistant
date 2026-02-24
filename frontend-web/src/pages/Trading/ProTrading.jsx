import React, { useState, useEffect, useRef } from 'react';
import OrderBook from '../../components/trading/OrderBook';
import OneClickTrade from '../../components/trading/OneClickTrade';
import AdvancedOrderModal from '../../components/trading/AdvancedOrderModal';
import CopyTrading from '../../components/trading/CopyTrading';
import styles from './ProTrading.module.css';
import api from '../../services/api';

const ProTrading = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USD');
  const [isAdvancedModalOpen, setAdvancedModalOpen] = useState(false);
  const [tickerStr, setTickerStr] = useState('Loading...');
  const container = useRef();

  // Load TradingView Widget
  useEffect(() => {
    if (!container.current) return;

    // Clean previous widget
    container.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;

    const tvSymbol = selectedSymbol.replace('/', ''); // BTC/USD -> BTCUSD

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${tvSymbol}T`,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      support_host: 'https://www.tradingview.com',
    });

    container.current.appendChild(script);
  }, [selectedSymbol]);

  // Live Ticker Update Polling
  useEffect(() => {
    const fetchTicker = async () => {
      try {
        const response = await api.get(`/api/v1/pro-market/ticker/24hr?symbol=${selectedSymbol}`);
        // Price is already in SLL from backend
        const price = response.data.lastPrice;
        const change = response.data.priceChangePercent;

        setTickerStr(
          `Le ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${change.toFixed(2)}%)`
        );
      } catch (e) {
        console.error('Ticker fetch error', e);
      }
    };

    fetchTicker();
    const interval = setInterval(fetchTicker, 5000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div className={styles.headerTitle}>
          <h1>LeoneAI Advanced Terminal</h1>
          <span className={styles.liveTicker}>
            {selectedSymbol}: {tickerStr}
          </span>
        </div>

        <div className={styles.controls}>
          <select
            value={selectedSymbol}
            onChange={e => setSelectedSymbol(e.target.value)}
            className={styles.symbolSelect}
          >
            <option value="BTC/USD">BTC/USD</option>
            <option value="ETH/USD">ETH/USD</option>
            <option value="SOL/USD">SOL/USD</option>
            <option value="BNB/USD">BNB/USD</option>
          </select>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column: Order Book & One Click */}
        <div className={styles.leftCol}>
          <OrderBook symbol={selectedSymbol} />
          <OneClickTrade symbol={selectedSymbol} />

          <button className={styles.advancedBtn} onClick={() => setAdvancedModalOpen(true)}>
            Open Advanced Order Type
          </button>
        </div>

        {/* Center Column: TradingView Chart */}
        <div className={styles.centerCol}>
          <div
            className={styles.chartContainer}
            ref={container}
            style={{ height: '600px', width: '100%' }}
          >
            <div
              className="tradingview-widget-container__widget"
              style={{ height: 'calc(100% - 32px)', width: '100%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Copy Trading */}
      <div className={styles.bottomSection}>
        <CopyTrading />
      </div>

      <AdvancedOrderModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setAdvancedModalOpen(false)}
        symbol={selectedSymbol}
      />
    </div>
  );
};

export default ProTrading;
