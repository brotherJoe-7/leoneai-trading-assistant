import React from 'react';
import styles from './SignalCard.module.css';
import Button from '../../common/Button/Button';

const SignalCard = ({ signal, onFollow, onIgnore }) => {
  const getActionColor = (action) => {
    switch (action?.toUpperCase()) {
      case 'BUY':
      case 'STRONG_BUY':
        return styles.buy;
      case 'SELL':
      case 'STRONG_SELL':
        return styles.sell;
      case 'HOLD':
        return styles.hold;
      default:
        return styles.neutral;
    }
  };

  const formatConfidence = (confidence) => {
    return `${confidence?.toFixed(1) || 0}%`;
  };

  const getRiskColor = (confidence) => {
    if (confidence >= 80) return styles.riskLow;
    if (confidence >= 60) return styles.riskMedium;
    return styles.riskHigh;
  };

  return (
    <div className={`${styles.signalCard} ${getActionColor(signal.action)}`}>
      <div className={styles.header}>
        <div className={styles.symbol}>
          <span className={styles.symbolText}>{signal.symbol}</span>
          <span className={`${styles.actionBadge} ${getActionColor(signal.action)}`}>
            {signal.action}
          </span>
        </div>
        
        <div className={styles.confidence}>
          <div className={styles.confidenceBar}>
            <div 
              className={`${styles.confidenceFill} ${getRiskColor(signal.confidence)}`}
              style={{ width: `${signal.confidence}%` }}
            />
          </div>
          <span className={styles.confidenceText}>
            {formatConfidence(signal.confidence)}
          </span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.strategy}>
          <span className={styles.label}>Strategy:</span>
          <span className={styles.value}>{signal.strategy}</span>
        </div>
        
        {signal.price && (
          <div className={styles.price}>
            <span className={styles.label}>Price:</span>
            <span className={styles.value}>${signal.price.toLocaleString()}</span>
            <span className={styles.leone}>
              Le {(signal.price * 22000).toLocaleString()}
            </span>
          </div>
        )}

        {signal.reason && (
          <div className={styles.reason}>
            <span className={styles.label}>Reason:</span>
            <p className={styles.reasonText}>{signal.reason}</p>
          </div>
        )}

        {signal.target_price && signal.stop_loss && (
          <div className={styles.targets}>
            <div className={styles.target}>
              <span className={styles.label}>Target:</span>
              <span className={`${styles.value} ${styles.targetPrice}`}>
                ${signal.target_price.toLocaleString()}
              </span>
            </div>
            <div className={styles.target}>
              <span className={styles.label}>Stop Loss:</span>
              <span className={`${styles.value} ${styles.stopLoss}`}>
                ${signal.stop_loss.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.timestamp}>
          {new Date(signal.timestamp).toLocaleString()}
        </div>
        
        <div className={styles.actions}>
          {onFollow && (
            <Button 
              variant="success" 
              size="small"
              onClick={() => onFollow(signal)}
            >
              Follow Signal
            </Button>
          )}
          
          {onIgnore && (
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => onIgnore(signal)}
            >
              Ignore
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignalCard;