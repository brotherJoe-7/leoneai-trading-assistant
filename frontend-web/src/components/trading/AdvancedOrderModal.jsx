import React, { useState } from 'react';
import styles from './Trading.module.css';
import api from '../../services/api';

const AdvancedOrderModal = ({ isOpen, onClose, symbol = 'BTC/USD' }) => {
  const [orderType, setOrderType] = useState('LIMIT');
  const [side, setSide] = useState('BUY');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [stopPrice, setStopPrice] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await api.post('/api/v1/pro-market/order', {
        symbol,
        side,
        type: orderType,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        stopPrice: stopPrice ? parseFloat(stopPrice) : null,
      });
      alert('Order Placed Successfully!');
      onClose();
    } catch (error) {
      alert('Failed to place order');
      console.error(error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Advanced Order - {symbol}</h2>

        <div className={styles.tabs}>
          {['LIMIT', 'MARKET', 'STOP_LIMIT', 'OCO'].map(type => (
            <button
              key={type}
              className={`${styles.tab} ${orderType === type ? styles.activeTab : ''}`}
              onClick={() => setOrderType(type)}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className={styles.formGroup}>
          <label>Side</label>
          <select value={side} onChange={e => setSide(e.target.value)}>
            <option value="BUY">BUY 🟢</option>
            <option value="SELL">SELL 🔴</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            placeholder="0.00"
          />
        </div>

        {orderType !== 'MARKET' && (
          <div className={styles.formGroup}>
            <label>Price (USD)</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>
        )}

        {(orderType === 'STOP_LIMIT' || orderType === 'OCO') && (
          <div className={styles.formGroup}>
            <label>Stop Price (Trigger)</label>
            <input
              type="number"
              value={stopPrice}
              onChange={e => setStopPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.confirmBtn}
            onClick={handleSubmit}
            style={{ backgroundColor: side === 'BUY' ? 'var(--primary-green)' : '#ff4d4d' }}
          >
            {side} {symbol}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedOrderModal;
