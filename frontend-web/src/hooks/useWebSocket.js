import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for WebSocket connection to market data
 * @param {string} symbol - Trading symbol (e.g., 'BTC-USD')
 * @param {boolean} enabled - Whether to connect (default: true)
 * @returns {object} - { price, connected, error }
 */
export const useMarketWebSocket = (symbol, enabled = true) => {
  const [price, setPrice] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!enabled || !symbol) return;

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`ws://localhost:8000/api/v1/ws/market/${symbol}`);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log(`WebSocket connected to ${symbol}`);
          setConnected(true);
          setError(null);
        };

        ws.onmessage = event => {
          try {
            const data = JSON.parse(event.data);
            if (data.error) {
              setError(data.error);
            } else {
              setPrice(data);
              setError(null);
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
            setError('Failed to parse price data');
          }
        };

        ws.onerror = event => {
          console.error('WebSocket error:', event);
          setError('Connection error');
          setConnected(false);
        };

        ws.onclose = () => {
          console.log(`WebSocket disconnected from ${symbol}`);
          setConnected(false);

          // Attempt to reconnect after 5 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect to ${symbol}...`);
            connectWebSocket();
          }, 5000);
        };
      } catch (err) {
        console.error('Error creating WebSocket:', err);
        setError('Failed to create connection');
      }
    };

    connectWebSocket();

    // Cleanup
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol, enabled]);

  return { price, connected, error };
};

/**
 * Custom hook for WebSocket connection to portfolio updates
 * @returns {object} - { portfolio, connected, error }
 */
export const usePortfolioWebSocket = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/api/v1/ws/portfolio');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Portfolio WebSocket connected');
      setConnected(true);
      setError(null);
    };

    ws.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        setPortfolio(data);
      } catch (err) {
        console.error('Error parsing portfolio data:', err);
        setError('Failed to parse portfolio data');
      }
    };

    ws.onerror = event => {
      console.error('Portfolio WebSocket error:', event);
      setError('Connection error');
      setConnected(false);
    };

    ws.onclose = () => {
      console.log('Portfolio WebSocket disconnected');
      setConnected(false);
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return { portfolio, connected, error };
};
