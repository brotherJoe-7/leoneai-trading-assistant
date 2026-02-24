import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const SLL_EXCHANGE_RATE = 23700; // 1 USD = 23,700 SLL

/**
 * Market data service for fetching live cryptocurrency prices
 * Uses CoinGecko API (free tier, no API key required)
 */
export const marketService = {
  /**
   * Get top cryptocurrencies by various metrics
   * @param {string} orderBy - Sorting criteria (market_cap_desc, volume_desc, price_change_percentage_24h_desc)
   * @param {number} limit - Number of coins to fetch
   * @returns {Promise<Array>} Array of coin data
   */
  getTopCoins: async (orderBy = 'market_cap_desc', limit = 10) => {
    try {
      const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: orderBy,
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h',
        },
        timeout: 10000, // 10 second timeout
      });

      return response.data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        price: coin.current_price,
        priceUsd: coin.current_price,
        priceSll: coin.current_price * SLL_EXCHANGE_RATE,
        change24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        rank: coin.market_cap_rank,
      }));
    } catch (error) {
      console.error('Error fetching top coins:', error);
      throw error;
    }
  },

  /**
   * Get trending/hot cryptocurrencies
   * @returns {Promise<Array>} Array of trending coins
   */
  getTrendingCoins: async () => {
    try {
      const response = await axios.get(`${COINGECKO_API}/search/trending`, {
        timeout: 10000,
      });

      // Get detailed data for trending coins
      const trendingIds = response.data.coins.slice(0, 10).map(item => item.item.id);
      const detailsResponse = await axios.get(`${COINGECKO_API}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: trendingIds.join(','),
          sparkline: false,
          price_change_percentage: '24h',
        },
      });

      return detailsResponse.data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        price: coin.current_price,
        priceUsd: coin.current_price,
        priceSll: coin.current_price * SLL_EXCHANGE_RATE,
        change24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        rank: coin.market_cap_rank,
      }));
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      throw error;
    }
  },

  /**
   * Get recently listed cryptocurrencies
   * @returns {Promise<Array>} Array of new coins
   */
  getNewListings: async () => {
    try {
      // CoinGecko doesn't have a dedicated "new listings" endpoint
      // We'll get coins sorted by market cap and filter by recent addition
      const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 50,
          page: 1,
          sparkline: false,
          price_change_percentage: '24h',
        },
        timeout: 10000,
      });

      // Filter for coins with lower market cap rank (newer coins tend to have higher ranks)
      const newCoins = response.data.filter(coin => coin.market_cap_rank > 100).slice(0, 10);

      return newCoins.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        price: coin.current_price,
        priceUsd: coin.current_price,
        priceSll: coin.current_price * SLL_EXCHANGE_RATE,
        change24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        volume: coin.total_volume,
        rank: coin.market_cap_rank,
      }));
    } catch (error) {
      console.error('Error fetching new listings:', error);
      throw error;
    }
  },

  /**
   * Get top gainers (24h price change)
   * @returns {Promise<Array>} Array of top gaining coins
   */
  getTopGainers: async () => {
    return marketService.getTopCoins('price_change_percentage_24h_desc', 10);
  },

  /**
   * Get top volume coins
   * @returns {Promise<Array>} Array of high volume coins
   */
  getTopVolume: async () => {
    return marketService.getTopCoins('volume_desc', 10);
  },

  /**
   * Convert USD to SLL
   * @param {number} usdAmount - Amount in USD
   * @returns {number} Amount in SLL
   */
  convertToSLL: usdAmount => {
    return usdAmount * SLL_EXCHANGE_RATE;
  },

  /**
   * Format price for display
   * @param {number} price - Price to format
   * @param {string} currency - Currency (USD or SLL)
   * @returns {string} Formatted price string
   */
  formatPrice: (price, currency = 'USD') => {
    if (currency === 'SLL') {
      return `Le ${price.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  },
};

export default marketService;
