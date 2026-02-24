import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async login(email, password) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData) {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  async getPortfolio() {
    const response = await this.client.get('/portfolio');
    return response.data;
  }

  async executeTrade(tradeData) {
    const response = await this.client.post('/trades/execute', tradeData);
    return response.data;
  }

  async getSignals(limit = 20) {
    const response = await this.client.get(`/signals?limit=${limit}`);
    return response.data;
  }

  async depositMobileMoney(provider, amount, phoneNumber) {
    const response = await this.client.post('/portfolio/mobile-money/deposit', {
      provider,
      amount,
      phone_number: phoneNumber,
    });
    return response.data;
  }

  convertToLeone(usdAmount) {
    return usdAmount * 22000;
  }

  convertToUSD(leoneAmount) {
    return leoneAmount / 22000;
  }
}

export default new ApiService();
