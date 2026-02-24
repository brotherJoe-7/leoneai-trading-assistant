import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from './Trading.module.css';

const OrderBook = ({ symbol = 'BTC/USD' }) => {
  const [depth, setDepth] = useState({ bids: [], asks: [] });

  useEffect(() => {
    const fetchDepth = async () => {
      try {
        const response = await api.get('/api/v1/pro-market/depth', { params: { symbol } });
        setDepth(response.data);
      } catch (error) {
        console.error('Failed to fetch order book', error);
      }
    };

    fetchDepth();
    const interval = setInterval(fetchDepth, 2000);
    return () => clearInterval(interval);
  }, [symbol]);

  // Helper to format SLL prices
  const formatSLL = val => {
    if (!val) return '0.00';
    return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Calculate max volume for depth bars
  const maxBidVol = depth.bids?.reduce((acc, curr) => Math.max(acc, curr[1]), 0) || 1;
  const maxAskVol = depth.asks?.reduce((acc, curr) => Math.max(acc, curr[1]), 0) || 1;

  return (
    <div className={styles.orderBook}>
      <div className={styles.header}>
        <h3>Order Book</h3>
        <span className={styles.symbol}>{symbol}</span>
      </div>

      <div className={styles.tableHeader}>
        <span>Price (SLL)</span>
        <span>Qty</span>
        <span>Total (SLL)</span>
      </div>

      <div className={styles.asks}>
        {depth.asks
          ?.slice(0, 8)
          .reverse()
          .map((ask, i) => (
            <div
              key={i}
              className={styles.row}
              style={{
                background: `linear-gradient(to left, rgba(255, 69, 58, 0.15) ${(ask[1] / maxAskVol) * 100}%, transparent 0%)`,
              }}
            >
              <span className={styles.sellPrice}>{formatSLL(ask[0])}</span>
              <span>{ask[1].toFixed(4)}</span>
              <span>{formatSLL(ask[0] * ask[1])}</span>
            </div>
          ))}
      </div>

      <div className={styles.spread}>
        {depth.bids[0] && depth.asks[0] ? (
          <>
            <span className={styles.currentPrice}>
              Le {formatSLL((depth.bids[0][0] + depth.asks[0][0]) / 2)}
            </span>
            <span className={styles.spreadPercent}>
              Spread:{' '}
              {(((depth.asks[0][0] - depth.bids[0][0]) / depth.bids[0][0]) * 100).toFixed(3)}%
            </span>
          </>
        ) : (
          <span>Loading...</span>
        )}
      </div>

      <div className={styles.bids}>
        {depth.bids?.slice(0, 8).map((bid, i) => (
          <div
            key={i}
            className={styles.row}
            style={{
              background: `linear-gradient(to left, rgba(0, 255, 136, 0.15) ${(bid[1] / maxBidVol) * 100}%, transparent 0%)`,
            }}
          >
            <span className={styles.buyPrice}>{formatSLL(bid[0])}</span>
            <span>{bid[1].toFixed(4)}</span>
            <span>{formatSLL(bid[0] * bid[1])}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
