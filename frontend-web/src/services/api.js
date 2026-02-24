import axios from 'axios';

// API Base URL — reads from VITE_API_URL env var (set in .env / Vercel dashboard)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance with timeout
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout to prevent hanging
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');

      // Try to refresh token
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken } = response.data;

          // Update tokens
          localStorage.setItem('token', access_token);
          if (newRefreshToken) {
            localStorage.setItem('refresh_token', newRefreshToken);
          }

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed - logout user
          console.error('Token refresh failed:', refreshError);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // No refresh token - logout
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000, // 10 second timeout
      });
      return response.data;
    } catch (error) {
      // Handle specific error cases
      if (error.code === 'ECONNABORTED') {
        throw new Error('Login request timed out. Please check your connection and try again.');
      }
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        throw new Error('Cannot connect to server. Please ensure the backend is running.');
      }
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw error;
    }
  },

  register: async userData => {
    const response = await api.post('/api/v1/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/v1/users/me');
    return response.data;
  },
};

// Portfolio API
export const portfolioAPI = {
  getPortfolio: async () => {
    const response = await api.get('/api/v1/portfolio');
    return response.data;
  },

  getHoldings: async () => {
    const response = await api.get('/api/v1/portfolio/holdings');
    return response.data;
  },

  executeTrade: async tradeData => {
    const response = await api.post('/api/v1/portfolio/trade', tradeData);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/api/v1/portfolio/stats');
    return response.data;
  },

  deposit: async body => {
    const response = await api.post('/api/v1/portfolio/deposit', body);
    return response.data;
  },

  withdraw: async body => {
    const response = await api.post('/api/v1/portfolio/withdraw', body);
    return response.data;
  },
};

// Signals API
export const signalsAPI = {
  getSignals: async (params = {}) => {
    const response = await api.get('/api/v1/signals', { params });
    return response.data;
  },

  getRecentSignals: async (limit = 10) => {
    const response = await api.get('/api/v1/signals/recent', { params: { limit } });
    return response.data;
  },

  followSignal: async signalId => {
    const response = await api.post(`/api/v1/signals/${signalId}/follow`);
    return response.data;
  },
};

// Subscription API
export const subscriptionAPI = {
  getCurrentSubscription: async () => {
    const response = await api.get('/api/v1/subscription/me');
    return response.data;
  },

  upgradeSubscription: async planType => {
    const response = await api.post('/api/v1/subscription/upgrade', { plan_type: planType });
    return response.data;
  },

  cancelSubscription: async () => {
    const response = await api.post('/api/v1/subscription/cancel');
    return response.data;
  },
};

// Market API
export const marketAPI = {
  getMarkets: async () => {
    const response = await api.get('/api/v1/markets');
    return response.data;
  },

  getMarketData: async symbol => {
    const response = await api.get(`/api/v1/markets/${symbol}`);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    const response = await api.get('/api/v1/admin/dashboard');
    return response.data;
  },

  getUsers: async (skip = 0, limit = 100) => {
    const response = await api.get('/api/v1/admin/users', { params: { skip, limit } });
    return response.data;
  },

  createUser: async userData => {
    const response = await api.post('/api/v1/admin/users', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await api.put(`/api/v1/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async userId => {
    const response = await api.delete(`/api/v1/admin/users/${userId}`);
    return response.data;
  },

  getTrades: async (skip = 0, limit = 100) => {
    const response = await api.get('/api/v1/admin/trades', { params: { skip, limit } });
    return response.data;
  },
};

export default api;
