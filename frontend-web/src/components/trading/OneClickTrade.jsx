import React, { useState } from 'react';
import api from '../../services/api';
import styles from './OneClickTrade.module.css';

const OneClickTrade = ({ symbol }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick amount buttons
  const quickAmounts = [0.1, 0.5, 1.0];

  const handleQuickTrade = async side => {
    if (!amount) return;

    setLoading(true);
    try {
      await api.post('/api/v1/portfolio/trade', {
        symbol,
        action: side, // specific to Portfolio Engine
        order_type: 'MARKET',
        quantity: parseFloat(amount),
      });

      // Show success message
      alert(`⚡ SPEED TRADE EXECUTED: ${side} ${amount} ${symbol.split('/')[0]}`);
      setAmount('');
    } catch (error) {
      console.error(error);
      alert('Trade failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>LeoneAI Speed Trade</h3>
        <span className={styles.badge}>⚡ INSTANT</span>
      </div>

      <div className={styles.inputGroup}>
        <label>Quantity ({symbol.split('/')[0]})</label>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
      </div>

      <div className={styles.quickButtons}>
        {quickAmounts.map(amt => (
          <button key={amt} onClick={() => setAmount(amt)}>
            {amt}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.buyBtn}`}
          onClick={() => handleQuickTrade('BUY')}
          disabled={loading}
        >
          {loading ? '...' : 'BUY'}
        </button>
        <button
          className={`${styles.btn} ${styles.sellBtn}`}
          onClick={() => handleQuickTrade('SELL')}
          disabled={loading}
        >
          {loading ? '...' : 'SELL'}
        </button>
      </div>
    </div>
  );
};

export default OneClickTrade;
