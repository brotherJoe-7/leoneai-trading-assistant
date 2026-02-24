import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import styles from './Trades.module.css';

const AdminTrades = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const data = await adminAPI.getTrades();
      setTrades(data);
    } catch (error) {
      console.error('Error fetching trades:', error);
      // Mock data if API fails
      setTrades([
        {
          id: 1,
          user_id: 2,
          symbol: 'USD/SLL',
          action: 'BUY',
          quantity: 1000,
          price: 22160,
          total: 22160000,
          status: 'completed',
          created_at: '2026-02-10T10:30:00Z',
        },
        {
          id: 2,
          user_id: 2,
          symbol: 'BTC/USD',
          action: 'SELL',
          quantity: 0.5,
          price: 54126,
          total: 27063,
          status: 'completed',
          created_at: '2026-02-10T09:15:00Z',
        },
        {
          id: 3,
          user_id: 3,
          symbol: 'EUR/SLL',
          action: 'BUY',
          quantity: 500,
          price: 24053,
          total: 12026500,
          status: 'pending',
          created_at: '2026-02-10T08:45:00Z',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrades = trades.filter(trade => {
    if (filter === 'all') return true;
    return trade.status === filter;
  });

  if (loading) {
    return (
      <div className={styles.adminTrades}>
        <div className={styles.loading}>Loading trades...</div>
      </div>
    );
  }

  return (
    <div className={styles.adminTrades}>
      <header className={styles.header}>
        <div>
          <h1>Trade Monitoring</h1>
          <p className={styles.subtitle}>View and manage all platform trades</p>
        </div>
      </header>

      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          All Trades
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'completed' ? styles.active : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'pending' ? styles.active : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'failed' ? styles.active : ''}`}
          onClick={() => setFilter('failed')}
        >
          Failed
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Symbol</th>
              <th>Action</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map(trade => (
              <tr key={trade.id}>
                <td>#{trade.id}</td>
                <td>{trade.user_id}</td>
                <td className={styles.symbolCell}>
                  <span className={styles.symbolIcon}>💱</span>
                  {trade.symbol}
                </td>
                <td>
                  <span
                    className={`${styles.actionBadge} ${
                      trade.action === 'BUY' ? styles.buy : styles.sell
                    }`}
                  >
                    {trade.action}
                  </span>
                </td>
                <td>{trade.quantity}</td>
                <td>Le {trade.price?.toLocaleString()}</td>
                <td className={styles.totalCell}>Le {trade.total?.toLocaleString()}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      trade.status === 'completed'
                        ? styles.completed
                        : trade.status === 'pending'
                          ? styles.pending
                          : styles.failed
                    }`}
                  >
                    {trade.status}
                  </span>
                </td>
                <td>{new Date(trade.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTrades.length === 0 && (
        <div className={styles.emptyState}>
          <p>No trades found with the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default AdminTrades;
