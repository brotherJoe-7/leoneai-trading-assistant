/**
 * Enhanced Market Service for LeoneAI
 * Fetches live cryptocurrency and forex data
 */

import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/USD';

class EnhancedMarketService {
  constructor() {
    this.cache = {
      crypto: null,
      forex: null,
      lastUpdate: null,
    };
    this.updateInterval = null;
  }

  /**
   * Fetch live cryptocurrency prices from CoinGecko
   */
  async getCryptoPrices() {
    try {
      const coins = [
        'bitcoin',
        'ethereum',
        'binancecoin',
        'cardano',
        'polkadot',
        'dogecoin',
        'matic-network',
        'solana',
        'ripple',
        'litecoin',
      ];

      const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: coins.join(','),
          order: 'market_cap_desc',
          per_page: 50,
          sparkline: false,
          price_change_percentage: '24h',
        },
        timeout: 10000,
      });

      return response.data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        pair: `${coin.symbol.toUpperCase()}/USD`,
        price_usd: coin.current_price,
        price_sll: coin.current_price * 23.7, // Convert to SLL
        change_24h: coin.price_change_percentage_24h || 0,
        volume_24h: coin.total_volume,
        market_cap: coin.market_cap,
        image: coin.image,
        type: 'crypto',
      }));
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      return this.getMockCryptoData();
    }
  }

  /**
   * Fetch live forex rates
   */
  async getForexRates() {
    try {
      const response = await axios.get(EXCHANGE_RATE_API, {
        timeout: 10000,
      });

      const rates = response.data.rates;

      return [
        {
          pair: 'USD/SLL',
          name: 'US Dollar / Sierra Leone Leone',
          rate: 23.7,
          change_24h: 0.0,
          type: 'forex',
        },
        {
          pair: 'EUR/USD',
          name: 'Euro / US Dollar',
          rate: rates.EUR ? 1 / rates.EUR : 1.08,
          change_24h: 0.15,
          type: 'forex',
        },
        {
          pair: 'GBP/USD',
          name: 'British Pound / US Dollar',
          rate: rates.GBP ? 1 / rates.GBP : 1.27,
          change_24h: -0.08,
          type: 'forex',
        },
        {
          pair: 'USD/JPY',
          name: 'US Dollar / Japanese Yen',
          rate: rates.JPY || 149.5,
          change_24h: 0.22,
          type: 'forex',
        },
        {
          pair: 'AUD/USD',
          name: 'Australian Dollar / US Dollar',
          rate: rates.AUD ? 1 / rates.AUD : 0.65,
          change_24h: 0.12,
          type: 'forex',
        },
        {
          pair: 'USD/CAD',
          name: 'US Dollar / Canadian Dollar',
          rate: rates.CAD || 1.36,
          change_24h: -0.05,
          type: 'forex',
        },
      ];
    } catch (error) {
      console.error('Error fetching forex rates:', error);
      return this.getMockForexData();
    }
  }

  /**
   * Get all market data (crypto + forex)
   */
  async getAllMarkets() {
    try {
      const [crypto, forex] = await Promise.all([this.getCryptoPrices(), this.getForexRates()]);

      this.cache = {
        crypto,
        forex,
        lastUpdate: new Date(),
      };

      return {
        crypto,
        forex,
        all: [...crypto, ...forex],
        lastUpdate: this.cache.lastUpdate,
      };
    } catch (error) {
      console.error('Error fetching market data:', error);
      return {
        crypto: this.getMockCryptoData(),
        forex: this.getMockForexData(),
        all: [...this.getMockCryptoData(), ...this.getMockForexData()],
        lastUpdate: new Date(),
      };
    }
  }

  /**
   * Start real-time updates
   * @param {Function} callback - Function to call with updated data
   * @param {number} interval - Update interval in milliseconds (default: 30s)
   */
  startRealTimeUpdates(callback, interval = 30000) {
    // Initial fetch
    this.getAllMarkets().then(callback);

    // Set up interval
    this.updateInterval = setInterval(async () => {
      const data = await this.getAllMarkets();
      callback(data);
    }, interval);

    return this.updateInterval;
  }

  /**
   * Stop real-time updates
   */
  stopRealTimeUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Get cached data
   */
  getCachedData() {
    return this.cache;
  }

  /**
   * Mock crypto data (fallback)
   */
  getMockCryptoData() {
    return [
      {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        pair: 'BTC/USD',
        price_usd: 54000,
        price_sll: 54000 * 23.7,
        change_24h: 2.45,
        volume_24h: 28000000000,
        market_cap: 1050000000000,
        type: 'crypto',
      },
      {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        pair: 'ETH/USD',
        price_usd: 2800,
        price_sll: 2800 * 23.7,
        change_24h: 3.12,
        volume_24h: 15000000000,
        market_cap: 336000000000,
        type: 'crypto',
      },
      {
        id: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        pair: 'ADA/USD',
        price_usd: 0.52,
        price_sll: 0.52 * 23.7,
        change_24h: 1.85,
        volume_24h: 450000000,
        market_cap: 18000000000,
        type: 'crypto',
      },
      {
        id: 'polkadot',
        symbol: 'DOT',
        name: 'Polkadot',
        pair: 'DOT/USD',
        price_usd: 7.25,
        price_sll: 7.25 * 23.7,
        change_24h: -0.95,
        volume_24h: 280000000,
        market_cap: 9500000000,
        type: 'crypto',
      },
      {
        id: 'dogecoin',
        symbol: 'DOGE',
        name: 'Dogecoin',
        pair: 'DOGE/USD',
        price_usd: 0.085,
        price_sll: 0.085 * 23.7,
        change_24h: 5.67,
        volume_24h: 650000000,
        market_cap: 12000000000,
        type: 'crypto',
      },
      {
        id: 'matic-network',
        symbol: 'MATIC',
        name: 'Polygon',
        pair: 'MATIC/USD',
        price_usd: 0.92,
        price_sll: 0.92 * 23.7,
        change_24h: 2.34,
        volume_24h: 320000000,
        market_cap: 8500000000,
        type: 'crypto',
      },
    ];
  }

  /**
   * Mock forex data (fallback)
   */
  getMockForexData() {
    return [
      {
        pair: 'USD/SLL',
        name: 'US Dollar / Sierra Leone Leone',
        rate: 23.7,
        change_24h: 0.0,
        type: 'forex',
      },
      {
        pair: 'EUR/USD',
        name: 'Euro / US Dollar',
        rate: 1.08,
        change_24h: 0.15,
        type: 'forex',
      },
      {
        pair: 'GBP/USD',
        name: 'British Pound / US Dollar',
        rate: 1.27,
        change_24h: -0.08,
        type: 'forex',
      },
      {
        pair: 'USD/JPY',
        name: 'US Dollar / Japanese Yen',
        rate: 149.5,
        change_24h: 0.22,
        type: 'forex',
      },
    ];
  }

  /**
   * Filter markets by criteria
   */
  filterMarkets(markets, filter) {
    switch (filter) {
      case 'TOP_GAINERS':
        return [...markets].sort((a, b) => b.change_24h - a.change_24h).slice(0, 10);
      case 'TOP_LOSERS':
        return [...markets].sort((a, b) => a.change_24h - b.change_24h).slice(0, 10);
      case 'TOP_VOLUME':
        return [...markets]
          .filter(m => m.volume_24h)
          .sort((a, b) => b.volume_24h - a.volume_24h)
          .slice(0, 10);
      case 'CRYPTO':
        return markets.filter(m => m.type === 'crypto');
      case 'FOREX':
        return markets.filter(m => m.type === 'forex');
      default:
        return markets;
    }
  }

  /**
   * Search markets
   */
  searchMarkets(markets, query) {
    if (!query) return markets;

    const lowerQuery = query.toLowerCase();
    return markets.filter(
      m =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.symbol.toLowerCase().includes(lowerQuery) ||
        m.pair.toLowerCase().includes(lowerQuery)
    );
  }
}

// Export singleton instance
const enhancedMarketService = new EnhancedMarketService();
export default enhancedMarketService;
