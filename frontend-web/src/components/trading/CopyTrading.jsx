import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import styles from './CopyTrading.module.css';

const CopyTrading = () => {
  const [traders, setTraders] = useState([]);
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchTraders = async () => {
      try {
        const response = await api.get('/api/v1/copy-trading/traders');
        setTraders(response.data);
      } catch (error) {
        console.error('Error fetching traders', error);
      }
    };
    fetchTraders();
  }, []);

  const handleFollow = async traderId => {
    try {
      await api.post('/api/v1/copy-trading/follow', {
        trader_id: traderId,
        amount: 1000,
        stop_loss: 50,
      });
      setFollowing([...following, traderId]);
      alert('You are now copying this trader!');
    } catch (error) {
      alert('Failed to follow');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🏆 Top Traders to Copy</h2>
      </div>

      <div className={styles.grid}>
        {traders.map(trader => (
          <div key={trader.id} className={styles.card}>
            <div className={styles.avatar}>{trader.avatar}</div>
            <h3 className={styles.name}>{trader.name}</h3>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span>Win Rate</span>
                <span className={styles.highlight}>{trader.win_rate}%</span>
              </div>
              <div className={styles.stat}>
                <span>Return</span>
                <span className={styles.green}>+{trader.pnl_percent}%</span>
              </div>
            </div>

            <div className={styles.risk}>
              Drawdown Risk:
              <div className={styles.riskBar}>
                <div
                  className={styles.riskFill}
                  style={{
                    width: `${trader.risk_score * 10}%`,
                    background: trader.risk_score > 7 ? 'red' : 'orange',
                  }}
                />
              </div>
            </div>

            <button
              className={following.includes(trader.id) ? styles.followingBtn : styles.followBtn}
              onClick={() => handleFollow(trader.id)}
              disabled={following.includes(trader.id)}
            >
              {following.includes(trader.id) ? 'Following' : 'Copy Trades'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CopyTrading;
