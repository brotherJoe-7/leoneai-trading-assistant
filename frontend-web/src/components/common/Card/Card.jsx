import React from 'react';
import styles from './Card.module.css';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  actions,
  padding = true,
  hoverable = false,
  className = '',
  ...props 
}) => {
  const cardClass = `
    ${styles.card}
    ${padding ? styles.padded : ''}
    ${hoverable ? styles.hoverable : ''}
    ${className}
  `.trim();

  return (
    <div className={cardClass} {...props}>
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
      
      <div className={styles.content}>
        {children}
      </div>
      
      {actions && (
        <div className={styles.actions}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card;