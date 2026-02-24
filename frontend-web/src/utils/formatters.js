// Currency formatting utilities
// Exchange Rate: 1 USD = 23.70 SLL (New Leone)

export const USD_TO_SLL = 23.7;
export const SLL_TO_USD = 1 / 23.7;

/**
 * Format currency in Sierra Leone Leones
 */
export const formatLeone = amount => {
  if (amount === null || amount === undefined) return 'Le 0.00';
  return `Le ${parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format USD amount
 */
export const formatUSD = amount => {
  if (amount === null || amount === undefined) return '$0.00';
  return `$${parseFloat(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Convert USD to Leone
 */
export const usdToLeone = usdAmount => {
  return parseFloat(usdAmount) * USD_TO_SLL;
};

/**
 * Convert Leone to USD
 */
export const leoneToUSD = leoneAmount => {
  return parseFloat(leoneAmount) * SLL_TO_USD;
};

/**
 * Format percentage
 */
export const formatPercent = value => {
  if (value === null || value === undefined) return '0.00%';
  const num = parseFloat(value);
  return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
};

/**
 * Format number with commas
 */
export const formatNumber = value => {
  if (value === null || value === undefined) return '0';
  return parseFloat(value).toLocaleString('en-US');
};

/**
 * Format crypto amount (8 decimals)
 */
export const formatCrypto = amount => {
  if (amount === null || amount === undefined) return '0.00000000';
  return parseFloat(amount).toFixed(8);
};

/**
 * Format date
 */
export const formatDate = date => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format datetime
 */
export const formatDateTime = date => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
