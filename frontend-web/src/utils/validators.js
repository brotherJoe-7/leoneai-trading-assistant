import { VALIDATION_RULES } from './constants';

// Validation functions
export const validators = {
  // Required field
  required: (value) => {
    if (value === undefined || value === null || value === '') {
      return 'This field is required';
    }
    return true;
  },

  // Email validation
  email: (value) => {
    if (!value) return true;
    
    const emailRegex = VALIDATION_RULES.EMAIL.PATTERN;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return true;
  },

  // Username validation
  username: (value) => {
    if (!value) return 'Username is required';
    
    const { MIN_LENGTH, MAX_LENGTH, PATTERN } = VALIDATION_RULES.USERNAME;
    
    if (value.length < MIN_LENGTH) {
      return `Username must be at least ${MIN_LENGTH} characters`;
    }
    
    if (value.length > MAX_LENGTH) {
      return `Username cannot exceed ${MAX_LENGTH} characters`;
    }
    
    if (!PATTERN.test(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    
    return true;
  },

  // Password validation
  password: (value) => {
    if (!value) return 'Password is required';
    
    const { MIN_LENGTH, REQUIRE_UPPERCASE, REQUIRE_LOWERCASE, REQUIRE_NUMBER } = VALIDATION_RULES.PASSWORD;
    
    if (value.length < MIN_LENGTH) {
      return `Password must be at least ${MIN_LENGTH} characters`;
    }
    
    if (REQUIRE_UPPERCASE && !/[A-Z]/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    
    if (REQUIRE_LOWERCASE && !/[a-z]/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    
    if (REQUIRE_NUMBER && !/\d/.test(value)) {
      return 'Password must contain at least one number';
    }
    
    return true;
  },

  // Confirm password
  confirmPassword: (value, password) => {
    if (!value) return 'Please confirm your password';
    
    if (value !== password) {
      return 'Passwords do not match';
    }
    
    return true;
  },

  // Phone number validation (Sierra Leone)
  phoneSL: (value) => {
    if (!value) return true;
    
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 9) {
      return true;
    }
    
    if (digits.length === 12 && digits.startsWith('232')) {
      return true;
    }
    
    return 'Please enter a valid Sierra Leone phone number (e.g., 88 123 456)';
  },

  // Number validation
  number: (value, options = {}) => {
    if (!value && value !== 0) return true;
    
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      return 'Please enter a valid number';
    }
    
    if (options.min !== undefined && num < options.min) {
      return `Value must be at least ${options.min}`;
    }
    
    if (options.max !== undefined && num > options.max) {
      return `Value cannot exceed ${options.max}`;
    }
    
    if (options.integer && !Number.isInteger(num)) {
      return 'Value must be a whole number';
    }
    
    return true;
  },

  // Positive number
  positiveNumber: (value) => {
    if (!value && value !== 0) return true;
    
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      return 'Please enter a valid number';
    }
    
    if (num <= 0) {
      return 'Value must be greater than 0';
    }
    
    return true;
  },

  // Percentage validation
  percentage: (value) => {
    if (!value && value !== 0) return true;
    
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      return 'Please enter a valid percentage';
    }
    
    if (num < 0 || num > 100) {
      return 'Percentage must be between 0 and 100';
    }
    
    return true;
  },

  // URL validation
  url: (value) => {
    if (!value) return true;
    
    try {
      new URL(value);
      return true;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  // Date validation
  date: (value) => {
    if (!value) return true;
    
    const date = new Date(value);
    
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    
    return true;
  },

  // Future date validation
  futureDate: (value) => {
    if (!value) return true;
    
    const date = new Date(value);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    
    if (date <= now) {
      return 'Date must be in the future';
    }
    
    return true;
  },

  // Past date validation
  pastDate: (value) => {
    if (!value) return true;
    
    const date = new Date(value);
    const now = new Date();
    
    if (isNaN(date.getTime())) {
      return 'Please enter a valid date';
    }
    
    if (date >= now) {
      return 'Date must be in the past';
    }
    
    return true;
  },

  // Trade amount validation
  tradeAmount: (value, balance) => {
    if (!value && value !== 0) return 'Amount is required';
    
    const amount = parseFloat(value);
    
    if (isNaN(amount)) {
      return 'Please enter a valid amount';
    }
    
    if (amount <= 0) {
      return 'Amount must be greater than 0';
    }
    
    if (balance !== undefined && amount > balance) {
      return 'Insufficient funds';
    }
    
    return true;
  },

  // Trade quantity validation
  tradeQuantity: (value) => {
    if (!value && value !== 0) return 'Quantity is required';
    
    const quantity = parseFloat(value);
    
    if (isNaN(quantity)) {
      return 'Please enter a valid quantity';
    }
    
    if (quantity <= 0) {
      return 'Quantity must be greater than 0';
    }
    
    return true;
  },

  // Price validation
  price: (value) => {
    if (!value && value !== 0) return 'Price is required';
    
    const price = parseFloat(value);
    
    if (isNaN(price)) {
      return 'Please enter a valid price';
    }
    
    if (price <= 0) {
      return 'Price must be greater than 0';
    }
    
    return true;
  },

  // Stop loss validation
  stopLoss: (value, entryPrice, isLong = true) => {
    if (!value && value !== 0) return true;
    
    const stopLoss = parseFloat(value);
    
    if (isNaN(stopLoss)) {
      return 'Please enter a valid stop loss price';
    }
    
    if (stopLoss <= 0) {
      return 'Stop loss must be greater than 0';
    }
    
    if (isLong && stopLoss >= entryPrice) {
      return 'Stop loss must be below entry price for long positions';
    }
    
    if (!isLong && stopLoss <= entryPrice) {
      return 'Stop loss must be above entry price for short positions';
    }
    
    return true;
  },

  // Take profit validation
  takeProfit: (value, entryPrice, isLong = true) => {
    if (!value && value !== 0) return true;
    
    const takeProfit = parseFloat(value);
    
    if (isNaN(takeProfit)) {
      return 'Please enter a valid take profit price';
    }
    
    if (takeProfit <= 0) {
      return 'Take profit must be greater than 0';
    }
    
    if (isLong && takeProfit <= entryPrice) {
      return 'Take profit must be above entry price for long positions';
    }
    
    if (!isLong && takeProfit >= entryPrice) {
      return 'Take profit must be below entry price for short positions';
    }
    
    return true;
  },

  // Risk percentage validation
  riskPercentage: (value) => {
    if (!value && value !== 0) return 'Risk percentage is required';
    
    const risk = parseFloat(value);
    
    if (isNaN(risk)) {
      return 'Please enter a valid risk percentage';
    }
    
    if (risk <= 0) {
      return 'Risk percentage must be greater than 0';
    }
    
    if (risk > 100) {
      return 'Risk percentage cannot exceed 100%';
    }
    
    return true;
  },

  // Validate form
  validateForm: (formData, rules) => {
    const errors = {};
    let isValid = true;
    
    Object.keys(rules).forEach(field => {
      const value = formData[field];
      const fieldRules = rules[field];
      
      if (Array.isArray(fieldRules)) {
        for (const rule of fieldRules) {
          const result = rule(value, formData);
          if (result !== true) {
            errors[field] = result;
            isValid = false;
            break;
          }
        }
      } else {
        const result = fieldRules(value, formData);
        if (result !== true) {
          errors[field] = result;
          isValid = false;
        }
      }
    });
    
    return { isValid, errors };
  },

  // Validate trading signal
  validateSignal: (signal) => {
    const errors = {};
    
    if (!signal.symbol) {
      errors.symbol = 'Symbol is required';
    }
    
    if (!signal.action) {
      errors.action = 'Action is required';
    } else if (!['BUY', 'SELL', 'HOLD', 'STRONG_BUY', 'STRONG_SELL'].includes(signal.action)) {
      errors.action = 'Invalid action';
    }
    
    if (!signal.confidence && signal.confidence !== 0) {
      errors.confidence = 'Confidence is required';
    } else if (signal.confidence < 0 || signal.confidence > 100) {
      errors.confidence = 'Confidence must be between 0 and 100';
    }
    
    if (!signal.strategy) {
      errors.strategy = 'Strategy is required';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Validate trade order
  validateTradeOrder: (order) => {
    const errors = {};
    
    if (!order.symbol) {
      errors.symbol = 'Symbol is required';
    }
    
    if (!order.action) {
      errors.action = 'Action is required';
    } else if (!['BUY', 'SELL'].includes(order.action)) {
      errors.action = 'Action must be BUY or SELL';
    }
    
    if (!order.quantity && order.quantity !== 0) {
      errors.quantity = 'Quantity is required';
    } else if (order.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
    
    if (!order.order_type) {
      errors.order_type = 'Order type is required';
    } else if (!['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'].includes(order.order_type)) {
      errors.order_type = 'Invalid order type';
    }
    
    if (order.order_type === 'LIMIT' || order.order_type === 'STOP_LIMIT') {
      if (!order.limit_price && order.limit_price !== 0) {
        errors.limit_price = 'Limit price is required for limit orders';
      } else if (order.limit_price <= 0) {
        errors.limit_price = 'Limit price must be greater than 0';
      }
    }
    
    if (order.order_type === 'STOP' || order.order_type === 'STOP_LIMIT') {
      if (!order.stop_price && order.stop_price !== 0) {
        errors.stop_price = 'Stop price is required for stop orders';
      } else if (order.stop_price <= 0) {
        errors.stop_price = 'Stop price must be greater than 0';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};