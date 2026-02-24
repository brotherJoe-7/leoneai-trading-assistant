import { TRADING_COLORS, SIERRA_LEONE } from './constants';

// General helper functions
export const helpers = {
  // Generate unique ID
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Deep clone object
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  // Check if object is empty
  isEmpty: (obj) => {
    return Object.keys(obj).length === 0;
  },

  // Merge objects
  merge: (target, source) => {
    return { ...target, ...source };
  },

  // Capitalize first letter
  capitalize: (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  // Format phone number for Sierra Leone
  formatPhoneSL: (phone) => {
    if (!phone) return '';
    
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    
    // Format: +232 XX XXX XXX
    if (digits.length === 9) {
      return `+232 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
    } else if (digits.length === 12 && digits.startsWith('232')) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    }
    
    return phone;
  },

  // Validate Sierra Leone phone number
  isValidPhoneSL: (phone) => {
    const digits = phone.replace(/\D/g, '');
    
    // Sierra Leone numbers: 9 digits or 12 digits starting with 232
    return digits.length === 9 || (digits.length === 12 && digits.startsWith('232'));
  },

  // Calculate Leone amount from USD
  calculateLeone: (usdAmount, exchangeRate = SIERRA_LEONE.EXCHANGE_RATE.USD_TO_SLL) => {
    return usdAmount * exchangeRate;
  },

  // Format Leone amount with thousands separator
  formatLeoneAmount: (amount) => {
    return `Le ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  },

  // Get color for trading action
  getActionColor: (action) => {
    const upperAction = action?.toUpperCase();
    
    switch (upperAction) {
      case 'BUY':
      case 'STRONG_BUY':
        return TRADING_COLORS.BUY;
      case 'SELL':
      case 'STRONG_SELL':
        return TRADING_COLORS.SELL;
      case 'HOLD':
        return TRADING_COLORS.HOLD;
      default:
        return TRADING_COLORS.NEUTRAL;
    }
  },

  // Get background color for trading action
  getActionBackground: (action) => {
    const color = helpers.getActionColor(action);
    return color + '20'; // Add 20 for 12% opacity in hex
  },

  // Calculate P&L percentage
  calculatePnLPercentage: (entryPrice, currentPrice) => {
    if (!entryPrice || entryPrice === 0) return 0;
    return ((currentPrice - entryPrice) / entryPrice) * 100;
  },

  // Format P&L with color
  formatPnL: (pnl, includeSign = true) => {
    const sign = includeSign && pnl > 0 ? '+' : '';
    const color = pnl >= 0 ? TRADING_COLORS.BUY : TRADING_COLORS.SELL;
    
    return {
      value: pnl,
      formatted: `${sign}${pnl.toFixed(2)}`,
      percentage: pnl >= 0 ? '+' : '',
      color
    };
  },

  // Calculate position size based on risk
  calculatePositionSize: (accountBalance, riskPercent, entryPrice, stopLoss) => {
    if (!stopLoss || stopLoss === entryPrice) return 0;
    
    const riskAmount = accountBalance * (riskPercent / 100);
    const riskPerUnit = Math.abs(entryPrice - stopLoss);
    
    return riskAmount / riskPerUnit;
  },

  // Sleep/pause function
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Copy to clipboard
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  },

  // Download data as JSON
  downloadJSON: (data, filename) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = filename || 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Parse query parameters
  parseQueryParams: (search) => {
    return Object.fromEntries(new URLSearchParams(search));
  },

  // Build query string
  buildQueryString: (params) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    
    return searchParams.toString();
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Check if running on mobile
  isMobile: () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },

  // Check if running on iOS
  isIOS: () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },

  // Check if running on Android
  isAndroid: () => {
    return /Android/.test(navigator.userAgent);
  },

  // Get browser name
  getBrowser: () => {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('SamsungBrowser')) return 'Samsung Internet';
    if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';
    if (userAgent.includes('Trident')) return 'Internet Explorer';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Safari')) return 'Safari';
    
    return 'Unknown';
  },

  // Generate random number in range
  randomInRange: (min, max) => {
    return Math.random() * (max - min) + min;
  },

  // Generate random integer in range
  randomIntInRange: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  // Shuffle array
  shuffleArray: (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  },

  // Remove duplicates from array
  removeDuplicates: (array, key) => {
    if (!key) {
      return [...new Set(array)];
    }
    
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  },

  // Group array by key
  groupBy: (array, key) => {
    return array.reduce((result, item) => {
      const groupKey = item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  },

  // Sort array by key
  sortBy: (array, key, descending = false) => {
    return [...array].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      
      if (aValue < bValue) return descending ? 1 : -1;
      if (aValue > bValue) return descending ? -1 : 1;
      return 0;
    });
  },

  // Filter array by search term
  filterBySearch: (array, searchTerm, keys) => {
    if (!searchTerm) return array;
    
    const term = searchTerm.toLowerCase();
    return array.filter(item => {
      return keys.some(key => {
        const value = item[key];
        return value && value.toString().toLowerCase().includes(term);
      });
    });
  },

  // Paginate array
  paginate: (array, page, pageSize) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return array.slice(start, end);
  },

  // Get Sierra Leone time
  getSLTime: () => {
    return new Date().toLocaleString('en-US', {
      timeZone: 'Africa/Freetown',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  },

  // Check if market is open (Sierra Leone time)
  isMarketOpen: (marketType = 'CRYPTO') => {
    const now = new Date();
    const slTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Freetown' }));
    const hour = slTime.getHours();
    const day = slTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    switch (marketType) {
      case 'CRYPTO':
        return true; // 24/7
        
      case 'FOREX':
        // Forex: 24/5 (Monday-Friday)
        return day >= 1 && day <= 5;
        
      case 'STOCKS':
        // US Stocks: 9:30 AM - 4:00 PM EST
        // Convert to Sierra Leone time (GMT)
        const estHour = hour + 5; // EST is GMT-5, Sierra Leone is GMT
        
        // Check if weekday
        if (day >= 1 && day <= 5) {
          // Check if within trading hours
          return estHour >= 9.5 && estHour < 16;
        }
        return false;
        
      default:
        return false;
    }
  },

  // Calculate days between dates
  daysBetween: (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
  },

  // Format duration
  formatDuration: (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  },

  // Create price alert message
  createPriceAlert: (symbol, currentPrice, targetPrice, condition) => {
    const direction = condition === 'above' ? 'above' : 'below';
    const change = ((targetPrice - currentPrice) / currentPrice * 100).toFixed(2);
    const changeText = change >= 0 ? `+${change}%` : `${change}%`;
    
    return {
      title: `${symbol} Price Alert`,
      message: `${symbol} is now ${direction} $${targetPrice}. Current price: $${currentPrice} (${changeText})`,
      type: condition === 'above' ? 'success' : 'warning',
      timestamp: new Date().toISOString()
    };
  },

  // Validate email
  validateEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validate URL
  validateURL: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Generate avatar from name
  generateAvatar: (name) => {
    if (!name) return '?';
    
    const names = name.split(' ');
    let initials = names[0].charAt(0).toUpperCase();
    
    if (names.length > 1) {
      initials += names[names.length - 1].charAt(0).toUpperCase();
    }
    
    return initials;
  },

  // Get avatar color based on name
  getAvatarColor: (name) => {
    if (!name) return TRADING_COLORS.PRIMARY;
    
    const colors = [
      '#1EB53A', // Green
      '#0072C6', // Blue
      '#10b981', // Emerald
      '#f59e0b', // Amber
      '#ef4444', // Red
      '#8b5cf6', // Violet
      '#06b6d4'  // Cyan
    ];
    
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  }
};