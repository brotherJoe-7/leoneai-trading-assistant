import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import enhancedMarketService from '../../services/enhancedMarketService';
import { formatLeone, formatUSD, formatPercent } from '../../utils/formatters';
import styles from './Markets.module.css';

const Markets = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL');
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initial fetch
    fetchMarkets();

    // Start real-time updates (every 30 seconds)
    const intervalId = enhancedMarketService.startRealTimeUpdates(
      data => {
        setMarkets(data.all);
        setLastUpdate(data.lastUpdate);
        setLoading(false);
        setError('');
      },
      30000 // 30 seconds
    );

    // Cleanup on unmount
    return () => {
      enhancedMarketService.stopRealTimeUpdates();
    };
  }, []);

  const fetchMarkets = async () => {
    try {
      setLoading(true);
      const data = await enhancedMarketService.getAllMarkets();
      setMarkets(data.all);
      setLastUpdate(data.lastUpdate);
      setError('');
    } catch (err) {
      console.error('Error fetching markets:', err);
      setError('Failed to load market data. Showing cached data.');
    } finally {
      setLoading(false);
    }
  };

  // Filter markets based on active tab
  const getFilteredMarkets = () => {
    let filtered = markets;

    // Apply tab filter
    if (activeTab === 'CRYPTO') {
      filtered = filtered.filter(m => m.type === 'crypto');
    } else if (activeTab === 'FOREX') {
      filtered = filtered.filter(m => m.type === 'forex');
    }

    // Apply additional filter
    if (filter !== 'ALL') {
      filtered = enhancedMarketService.filterMarkets(filtered, filter);
    }

    // Apply search
    if (searchQuery) {
      filtered = enhancedMarketService.searchMarkets(filtered, searchQuery);
    }

    return filtered;
  };

  const filteredMarkets = getFilteredMarkets();

  const formatVolume = volume => {
    if (!volume) return 'N/A';
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`;
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`;
    return `$${volume.toFixed(2)}`;
  };

  const formatMarketCap = cap => {
    if (!cap) return 'N/A';
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toFixed(2)}`;
  };

  return (
    <div className={styles.markets}>
      <header className={styles.header}>
        <div>
          <h1>Markets</h1>
          <p className={styles.subtitle}>
            Real-time market data for Sierra Leone traders
            {lastUpdate && (
              <span className={styles.updateTime}>
                {' '}
                • Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search markets or assets..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className={styles.refreshBtn} onClick={fetchMarkets} disabled={loading}>
            <span>{loading ? '⏳' : '🔄'}</span>
          </button>
        </div>
      </header>

      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️</span> {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'ALL' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          All
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'CRYPTO' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('CRYPTO')}
        >
          Crypto ₿
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'FOREX' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('FOREX')}
        >
          Forex 💱
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <button
          className={`${styles.filterBtn} ${filter === 'ALL' ? styles.activeFilter : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All Markets
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'TOP_GAINERS' ? styles.activeFilter : ''}`}
          onClick={() => setFilter('TOP_GAINERS')}
        >
          🔥 Top Gainers
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'TOP_LOSERS' ? styles.activeFilter : ''}`}
          onClick={() => setFilter('TOP_LOSERS')}
        >
          📉 Top Losers
        </button>
        <button
          className={`${styles.filterBtn} ${filter === 'TOP_VOLUME' ? styles.activeFilter : ''}`}
          onClick={() => setFilter('TOP_VOLUME')}
        >
          📊 Top Volume
        </button>
      </div>

      {/* Markets Table */}
      {loading && markets.length === 0 ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading market data...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Price (USD)</th>
                <th>Price (SLL)</th>
                <th>24h Change</th>
                <th>24h Volume</th>
                {activeTab !== 'FOREX' && <th>Market Cap</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMarkets.length === 0 ? (
                <tr>
                  <td colSpan="7" className={styles.noResults}>
                    No markets found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredMarkets.map((market, index) => (
                  <tr key={index} className={styles.marketRow}>
                    <td>
                      <div className={styles.assetCell}>
                        {market.image && (
                          <img src={market.image} alt={market.name} className={styles.assetIcon} />
                        )}
                        {!market.image && (
                          <div className={styles.assetIconPlaceholder}>
                            {market.type === 'crypto' ? '₿' : '💱'}
                          </div>
                        )}
                        <div>
                          <p className={styles.assetName}>{market.name}</p>
                          <p className={styles.assetSymbol}>{market.pair || market.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className={styles.priceCell}>
                      {market.type === 'crypto'
                        ? formatUSD(market.price_usd)
                        : market.rate.toFixed(4)}
                    </td>
                    <td className={styles.priceCell}>
                      {market.type === 'crypto'
                        ? formatLeone(market.price_sll)
                        : formatLeone(market.rate * 23.7)}
                    </td>
                    <td>
                      <span className={market.change_24h >= 0 ? styles.positive : styles.negative}>
                        {formatPercent(market.change_24h)}
                      </span>
                    </td>
                    <td>{formatVolume(market.volume_24h)}</td>
                    {activeTab !== 'FOREX' && <td>{formatMarketCap(market.market_cap)}</td>}
                    <td>
                      <button
                        className={styles.tradeBtn}
                        onClick={() => navigate('/trading', { state: { asset: market } })}
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Market Stats Summary */}
      {!loading && filteredMarkets.length > 0 && (
        <div className={styles.statsFooter}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Total Markets:</span>
            <span className={styles.statValue}>{filteredMarkets.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Gainers:</span>
            <span className={styles.statValue}>
              {filteredMarkets.filter(m => m.change_24h > 0).length}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Losers:</span>
            <span className={styles.statValue}>
              {filteredMarkets.filter(m => m.change_24h < 0).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Markets;
