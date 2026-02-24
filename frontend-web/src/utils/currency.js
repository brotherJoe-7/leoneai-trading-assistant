/**
 * Currency Conversion Utilities
 * Centralized currency conversion for LeoneAI platform
 * Exchange Rate: 1 USD = 23.70 SLL (New Leone)
 */

// Exchange rates
export const USD_TO_SLL = 23.7; // 1 USD = 23.70 SLL (New Leone)
export const SLL_TO_USD = 1 / 23.7;

/**
 * Convert USD to SLL
 * @param {number} usd - Amount in USD
 * @returns {number} Amount in SLL
 */
export const convertToSLL = usd => {
  return usd * USD_TO_SLL;
};

/**
 * Convert SLL to USD
 * @param {number} sll - Amount in SLL
 * @returns {number} Amount in USD
 */
export const convertToUSD = sll => {
  return sll * SLL_TO_USD;
};

/**
 * Format SLL amount with proper locale formatting
 * @param {number} amount - Amount in SLL
 * @returns {string} Formatted SLL string (e.g., "Le 118.50")
 */
export const formatSLL = amount => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Le 0.00';
  }
  return `Le ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format USD amount with proper locale formatting
 * @param {number} amount - Amount in USD
 * @returns {string} Formatted USD string (e.g., "$5.00")
 */
export const formatUSD = amount => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00';
  }
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format percentage
 * @param {number} percent - Percentage value
 * @returns {string} Formatted percentage (e.g., "+2.45%")
 */
export const formatPercent = percent => {
  if (percent === null || percent === undefined || isNaN(percent)) {
    return '0.00%';
  }
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
};

/**
 * Parse SLL input (removes formatting)
 * @param {string} input - Formatted SLL string
 * @returns {number} Numeric SLL value
 */
export const parseSLL = input => {
  if (typeof input === 'number') return input;
  return parseFloat(input.replace(/[^0-9.-]/g, '')) || 0;
};

/**
 * Calculate trade cost in SLL
 * @param {number} quantity - Trade quantity
 * @param {number} priceUSD - Price per unit in USD
 * @returns {object} { costUSD, costSLL }
 */
export const calculateTradeCost = (quantity, priceUSD) => {
  const costUSD = quantity * priceUSD;
  const costSLL = convertToSLL(costUSD);
  return { costUSD, costSLL };
};

export default {
  USD_TO_SLL,
  SLL_TO_USD,
  convertToSLL,
  convertToUSD,
  formatSLL,
  formatUSD,
  formatPercent,
  parseSLL,
  calculateTradeCost,
};
