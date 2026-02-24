// Trading Constants
export const TRADING_CONSTANTS = {
  // Signal Actions
  SIGNAL_ACTIONS: {
    BUY: 'BUY',
    SELL: 'SELL',
    HOLD: 'HOLD',
    STRONG_BUY: 'STRONG_BUY',
    STRONG_SELL: 'STRONG_SELL'
  },
  
  // Signal Confidence Levels
  CONFIDENCE_LEVELS: {
    HIGH: 80,
    MEDIUM: 60,
    LOW: 0
  },
  
  // Risk Levels
  RISK_LEVELS: {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
  },
  
  // Order Types
  ORDER_TYPES: {
    MARKET: 'MARKET',
    LIMIT: 'LIMIT',
    STOP: 'STOP',
    STOP_LIMIT: 'STOP_LIMIT'
  },
  
  // Timeframes
  TIMEFRAMES: {
    '1m': '1 Minute',
    '5m': '5 Minutes',
    '15m': '15 Minutes',
    '1h': '1 Hour',
    '4h': '4 Hours',
    '1d': '1 Day',
    '1w': '1 Week',
    '1M': '1 Month'
  },
  
  // Trading Hours (Sierra Leone Time)
  TRADING_HOURS: {
    CRYPTO: '24/7',
    FOREX: '24/5 (Monday-Friday)',
    STOCKS: '9:30 AM - 4:00 PM EST'
  }
};

// Sierra Leone Specific
export const SIERRA_LEONE = {
  CURRENCY: {
    CODE: 'SLL',
    SYMBOL: 'Le',
    NAME: 'Sierra Leonean Leone'
  },
  
  EXCHANGE_RATE: {
    USD_TO_SLL: 22000, // Approximate rate
    LAST_UPDATED: '2026-02-03'
  },
  
  MOBILE_MONEY: {
    PROVIDERS: ['Orange Money', 'Africell Money', 'Q Money'],
    SUPPORTED: true
  },
  
  TIMEZONE: 'Africa/Freetown',
  COUNTRY_CODE: 'SL',
  PHONE_PREFIX: '+232',
  
  // Major Cities (for localization)
  MAJOR_CITIES: ['Freetown', 'Bo', 'Kenema', 'Makeni', 'Koidu']
};

// App Constants
export const APP_CONSTANTS = {
  APP_NAME: 'LeoneAI Trading Assistant',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'AI-powered trading assistant for Sierra Leonean traders',
  
  // API Configuration
  API: {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3
  },
  
  // WebSocket Configuration
  WS: {
    BASE_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
    RECONNECT_DELAY: 5000,
    PING_INTERVAL: 30000
  },
  
  // Feature Flags
  FEATURES: {
    VIRTUAL_TRADING: true,
    REAL_TRADING: false,
    MOBILE_MONEY: false,
    MULTI_LANGUAGE: false,
    ADVANCED_CHARTS: true
  },
  
  // Limits
  LIMITS: {
    MAX_PORTFOLIO_SIZE: 1000000,
    MIN_TRADE_AMOUNT: 10,
    MAX_SIGNALS_PER_PAGE: 50,
    MAX_HISTORY_DAYS: 365
  },
  
  // Default Values
  DEFAULTS: {
    CURRENCY: 'SLL',
    RISK_TOLERANCE: 'MODERATE',
    THEME: 'dark',
    LANGUAGE: 'en',
    NOTIFICATIONS: true
  }
};

// Market Symbols
export const MARKET_SYMBOLS = {
  CRYPTO: [
    'BTC-USD', // Bitcoin
    'ETH-USD', // Ethereum
    'XRP-USD', // Ripple
    'ADA-USD', // Cardano
    'SOL-USD', // Solana
    'DOT-USD', // Polkadot
    'DOGE-USD', // Dogecoin
    'MATIC-USD' // Polygon
  ],
  
  FOREX: [
    'USDSLL', // US Dollar / Sierra Leone Leone
    'EURUSD', // Euro / US Dollar
    'GBPUSD', // British Pound / US Dollar
    'USDJPY', // US Dollar / Japanese Yen
    'USDCHF', // US Dollar / Swiss Franc
    'AUDUSD', // Australian Dollar / US Dollar
    'USDCAD', // US Dollar / Canadian Dollar
    'NZDUSD'  // New Zealand Dollar / US Dollar
  ],
  
  STOCKS: [
    'AAPL', // Apple
    'GOOGL', // Google
    'MSFT', // Microsoft
    'AMZN', // Amazon
    'TSLA', // Tesla
    'META', // Meta
    'NVDA', // NVIDIA
    'JPM'   // JPMorgan Chase
  ],
  
  COMMODITIES: [
    'GC=F', // Gold
    'SI=F', // Silver
    'CL=F', // Crude Oil
    'NG=F', // Natural Gas
    'ZC=F', // Corn
    'ZW=F'  // Wheat
  ]
};

// Color Constants for Trading
export const TRADING_COLORS = {
  BUY: '#10b981',    // Green
  SELL: '#ef4444',   // Red
  HOLD: '#f59e0b',   // Yellow
  NEUTRAL: '#6b7280', // Gray
  
  // Chart Colors
  CHART: {
    PRIMARY: '#1EB53A',   // LeoneAI Green
    SECONDARY: '#0072C6', // LeoneAI Blue
    BACKGROUND: '#0a0a0a',
    GRID: '#1a1a1a',
    TEXT: '#ffffff'
  },
  
  // Risk Levels
  RISK: {
    LOW: '#10b981',    // Green
    MEDIUM: '#f59e0b', // Yellow
    HIGH: '#ef4444'    // Red
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'leoneai_token',
  USER_DATA: 'leoneai_user',
  SETTINGS: 'leoneai_settings',
  PORTFOLIO: 'leoneai_portfolio',
  RECENT_TRADES: 'leoneai_recent_trades',
  WATCHLIST: 'leoneai_watchlist'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timeout. Please try again.',
  INVALID_DATA: 'Invalid data provided.',
  INSUFFICIENT_FUNDS: 'Insufficient funds to complete this trade.',
  MARKET_CLOSED: 'Market is currently closed.',
  RATE_LIMIT: 'Too many requests. Please wait and try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Account created successfully!',
  TRADE_EXECUTED: 'Trade executed successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  FUNDS_ADDED: 'Funds added successfully!',
  SIGNAL_FOLLOWED: 'Signal followed successfully!'
};

// Validation Rules
export const VALIDATION_RULES = {
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/
  },
  
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: false
  },
  
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  
  TRADE: {
    MIN_AMOUNT: 10,
    MAX_AMOUNT: 10000,
    MIN_QUANTITY: 0.001,
    MAX_QUANTITY: 1000
  }
};