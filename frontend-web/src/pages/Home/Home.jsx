import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import PriceChart from '../../components/trading/PriceChart/PriceChart';
import SignalCard from '../../components/trading/SignalCard/SignalCard';

const Home = () => {
  const navigate = useNavigate();
  const [signals, setSignals] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demonstration
    const mockSignals = [
      {
        id: 1,
        symbol: 'BTC-USD',
        action: 'BUY',
        confidence: 85.5,
        strategy: 'RSI Strategy',
        timestamp: new Date().toISOString(),
        reason: 'RSI oversold at 28.5, bullish divergence detected',
        price: 45000.50,
        target_price: 48000.00,
        stop_loss: 42000.00
      },
      {
        id: 2,
        symbol: 'ETH-USD',
        action: 'HOLD',
        confidence: 65.0,
        strategy: 'MACD Strategy',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        reason: 'MACD neutral, waiting for confirmation above $3,300',
        price: 3200.75,
        target_price: 3400.00,
        stop_loss: 3000.00
      }
    ];

    const mockMarketData = [
      { x: '2026-01-01', y: 40000 },
      { x: '2026-01-02', y: 42000 },
      { x: '2026-01-03', y: 41000 },
      { x: '2026-01-04', y: 43000 },
      { x: '2026-01-05', y: 45000 },
      { x: '2026-01-06', y: 44000 },
      { x: '2026-01-07', y: 46000 },
    ];

    setTimeout(() => {
      setSignals(mockSignals);
      setMarketData(mockMarketData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFollowSignal = (signal) => {
    console.log('Following signal:', signal);
    navigate('/trade', { state: { signal } });
  };

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading LeoneAI...</p>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            AI-Powered Trading Assistant for{' '}
            <span className={styles.highlight}>Sierra Leone</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Trade smarter with 24/7 AI analysis, Leone currency support, and 
            mobile money integration. Designed for Sierra Leonean traders.
          </p>
          <div className={styles.heroActions}>
            <Button 
              variant="primary" 
              size="large"
              onClick={handleGetStarted}
            >
              Start Trading Demo
            </Button>
            <Button 
              variant="outline" 
              size="large"
              onClick={() => navigate('/learn')}
            >
              Learn Trading Basics
            </Button>
          </div>
        </div>
        
        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>24/7</div>
            <div className={styles.statLabel}>AI Analysis</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>Le</div>
            <div className={styles.statLabel}>Leone Support</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>85%</div>
            <div className={styles.statLabel}>Signal Accuracy</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>100%</div>
            <div className={styles.statLabel}>Virtual Demo</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Why Choose LeoneAI?</h2>
        
        <div className={styles.featuresGrid}>
          <Card title="Sierra Leone Focused" hoverable>
            <p>Built specifically for Sierra Leonean traders with Leone (SLL) currency support and local market insights.</p>
          </Card>
          
          <Card title="AI-Powered Signals" hoverable>
            <p>24/7 market analysis with intelligent buy/sell signals powered by advanced algorithms.</p>
          </Card>
          
          <Card title="Mobile Money Ready" hoverable>
            <p>Integrated with Orange Money and Africell for easy deposits and withdrawals in Leone.</p>
          </Card>
          
          <Card title="Virtual Trading" hoverable>
            <p>Practice with virtual money before risking real funds. Perfect for beginners.</p>
          </Card>
          
          <Card title="Educational Resources" hoverable>
            <p>Learn trading basics with Sierra Leone-specific tutorials and guides.</p>
          </Card>
          
          <Card title="Real-time Alerts" hoverable>
            <p>Get instant notifications for market movements and trading opportunities.</p>
          </Card>
        </div>
      </section>

      {/* Live Signals Preview */}
      <section className={styles.signalsPreview}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Live AI Signals</h2>
          <Button 
            variant="secondary" 
            size="small"
            onClick={() => navigate('/signals')}
          >
            View All Signals
          </Button>
        </div>
        
        <div className={styles.signalsGrid}>
          {signals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onFollow={handleFollowSignal}
            />
          ))}
        </div>
      </section>

      {/* Market Chart */}
      <section className={styles.marketChart}>
        <Card title="Bitcoin Price Chart (BTC-USD)" padding>
          <PriceChart data={marketData} height={300} />
          <div className={styles.chartFooter}>
            <div className={styles.currentPrice}>
              <span className={styles.priceLabel}>Current Price:</span>
              <span className={styles.priceValue}>$45,000.50</span>
              <span className={styles.leonePrice}>
                Le {(45000.50 * 22000).toLocaleString()}
              </span>
            </div>
            <div className={styles.priceChange}>
              <span className={styles.changeLabel}>24h Change:</span>
              <span className={styles.changePositive}>+2.5%</span>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <Card padding={false} className={styles.ctaCard}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to Start Trading?
            </h2>
            <p className={styles.ctaText}>
              Join thousands of Sierra Leonean traders using LeoneAI. 
              Start with virtual money and learn at your own pace.
            </p>
            <div className={styles.ctaActions}>
              <Button 
                variant="primary" 
                size="large"
                onClick={() => navigate('/register')}
              >
                Create Free Account
              </Button>
              <Button 
                variant="outline" 
                size="large"
                onClick={() => navigate('/learn')}
              >
                Watch Tutorial
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Home;