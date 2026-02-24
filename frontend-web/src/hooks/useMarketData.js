import { useState, useEffect, useCallback } from 'react';
import { marketAPI } from '../services/api';

export const useMarketData = (symbol = 'BTC-USD', interval = '1d') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceInLeone, setPriceInLeone] = useState(null);

  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch price data
      const priceData = await marketAPI.getPrice(symbol);
      
      // Fetch historical data
      const historyData = await marketAPI.getHistory(symbol, interval, '1mo');
      
      // Calculate Leone conversion
      const leoneValue = priceData.price * 22000; // Using fixed rate for now
      
      setData({
        current: priceData,
        history: historyData.data || [],
        symbol
      });
      
      setPriceInLeone({
        usd: priceData.price,
        leone: leoneValue,
        exchangeRate: 22000,
        formatted: `Le ${leoneValue.toLocaleString()}`
      });
      
    } catch (err) {
      setError(err.message || 'Failed to fetch market data');
      console.error('Market data error:', err);
    } finally {
      setLoading(false);
    }
  }, [symbol, interval]);

  const refresh = useCallback(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Initial fetch
  useEffect(() => {
    fetchMarketData();
    
    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(fetchMarketData, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchMarketData]);

  return {
    data,
    loading,
    error,
    priceInLeone,
    refresh,
    symbol
  };
};

// Hook for multiple symbols
export const useMarketDataMultiple = (symbols = ['BTC-USD', 'ETH-USD']) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMultipleData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const promises = symbols.map(symbol => marketAPI.getPrice(symbol));
      const results = await Promise.allSettled(promises);
      
      const marketData = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);
      
      setData(marketData);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch market data');
      console.error('Market data error:', err);
    } finally {
      setLoading(false);
    }
  }, [symbols]);

  useEffect(() => {
    fetchMultipleData();
    
    // Set up polling
    const intervalId = setInterval(fetchMultipleData, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchMultipleData]);

  return {
    data,
    loading,
    error,
    refresh: fetchMultipleData
  };
};

// Hook for WebSocket real-time data
export const useWebSocketMarketData = (symbols = ['BTC-USD']) => {
  const [prices, setPrices] = useState({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/market');
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      
      // Subscribe to symbols
      ws.send(JSON.stringify({
        type: 'subscribe',
        symbols
      }));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'market_update') {
          setPrices(prev => {
            const newPrices = { ...prev };
            data.data.forEach(item => {
              newPrices[item.symbol] = item;
            });
            return newPrices;
          });
        }
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnected(false);
    };
    
    return () => {
      ws.close();
    };
  }, [symbols]);

  return {
    prices,
    connected
  };
};