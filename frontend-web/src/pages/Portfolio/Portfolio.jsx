import React, { useState, useEffect } from 'react';
import { portfolioAPI } from '../../services/api';
import { formatLeone, formatUSD, formatPercent, usdToLeone } from '../../utils/formatters';
import styles from './Portfolio.module.css';

const PAYMENT_METHODS = [
  {
    value: 'Orange Money',
    label: '🇸🇱 Orange Money',
    type: 'mobile',
    placeholder: 'Enter mobile number (e.g. 074266392)',
  },
  {
    value: 'Afrimoney',
    label: '🇸🇱 Afrimoney',
    type: 'mobile',
    placeholder: 'Enter Afrimoney number',
  },
  {
    value: 'Bank Transfer',
    label: '🏦 Bank Transfer',
    type: 'bank',
    placeholder: 'Enter bank account number',
  },
  { value: 'PayPal', label: '💳 PayPal', type: 'email', placeholder: 'Enter PayPal email address' },
  { value: 'Stripe', label: '💳 Stripe', type: 'card', placeholder: 'Enter last 4 digits of card' },
  {
    value: 'Visa/Mastercard',
    label: '💳 Visa / Mastercard',
    type: 'card',
    placeholder: 'Enter last 4 digits of card',
  },
];

const Portfolio = () => {
  const [timeframe, setTimeframe] = useState('1W');
  const [portfolioData, setPortfolioData] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form states
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [tradeForm, setTradeForm] = useState({ action: 'BUY', quantity: '' });
  const [depositForm, setDepositForm] = useState({
    amount: '',
    method: 'Orange Money',
    detail: '',
  });
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    method: 'Orange Money',
    account: '',
  });

  const getPaymentMethod = value => PAYMENT_METHODS.find(m => m.value === value);

  // Loading and error states
  const [tradeLoading, setTradeLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const [portfolio, holdingsData] = await Promise.all([
        portfolioAPI.getPortfolio().catch(() => null),
        portfolioAPI.getHoldings().catch(() => []),
      ]);

      setPortfolioData(portfolio);
      setHoldings(holdingsData);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      setError('Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const executeTrade = async () => {
    if (!selectedAsset || !tradeForm.quantity || parseFloat(tradeForm.quantity) <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    setTradeLoading(true);
    setError('');

    try {
      const response = await portfolioAPI.executeTrade({
        symbol: selectedAsset.symbol,
        action: tradeForm.action,
        quantity: parseFloat(tradeForm.quantity),
        order_type: 'MARKET',
      });

      setSuccessMessage(
        response.message ||
          `Successfully ${tradeForm.action} ${tradeForm.quantity} ${selectedAsset.symbol} for ${formatLeone(response.total_cost_sll)}`
      );
      setShowSuccessModal(true);
      setShowTradeModal(false);
      setTradeForm({ action: 'BUY', quantity: '' });
      fetchPortfolioData();
    } catch (error) {
      setError(error.response?.data?.detail || error.message || 'Trade failed');
    } finally {
      setTradeLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositForm.amount || parseFloat(depositForm.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setDepositLoading(true);
    setError('');

    try {
      const pm = getPaymentMethod(depositForm.method);
      const body = {
        amount_sll: parseFloat(depositForm.amount),
        payment_method: depositForm.method,
        ...(pm?.type === 'mobile' && { phone_number: depositForm.detail }),
        ...(pm?.type === 'email' && { email: depositForm.detail }),
        ...(pm?.type === 'card' && { card_last4: depositForm.detail }),
      };

      const data = await portfolioAPI.deposit(body);

      setSuccessMessage(
        data.message ||
          `Successfully deposited ${formatLeone(data.amount_sll)} via ${data.payment_method}. New balance: ${formatLeone(data.new_balance_sll)}`
      );
      setShowSuccessModal(true);
      setShowDepositModal(false);
      setDepositForm({ amount: '', method: 'Orange Money', detail: '' });
      fetchPortfolioData();
    } catch (error) {
      setError(error.response?.data?.detail || error.message || 'Deposit failed');
    } finally {
      setDepositLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawForm.amount || parseFloat(withdrawForm.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (!withdrawForm.account) {
      setError('Please enter account details');
      return;
    }

    setWithdrawLoading(true);
    setError('');

    try {
      const data = await portfolioAPI.withdraw({
        amount_sll: parseFloat(withdrawForm.amount),
        payment_method: withdrawForm.method,
        account_details: withdrawForm.account,
      });

      setSuccessMessage(
        data.message ||
          `Successfully withdrew ${formatLeone(data.amount_sll)} to ${data.payment_method}. New balance: ${formatLeone(data.new_balance_sll)}`
      );
      setShowSuccessModal(true);
      setShowWithdrawModal(false);
      setWithdrawForm({ amount: '', method: 'Orange Money', account: '' });
      fetchPortfolioData();
    } catch (error) {
      setError(error.response?.data?.detail || error.message || 'Withdrawal failed');
    } finally {
      setWithdrawLoading(false);
    }
  };

  // Mock data for display if API fails
  const mockData = {
    total_value_sll: 2844000, // $120 * 23,700
    daily_change_percent: 2.45,
    total_profit_sll: 284400, // $12 * 23,700
    cash_balance_sll: 1185000, // $50 * 23,700
  };

  const mockHoldings = [
    {
      symbol: 'BTC/USD',
      name: 'Bitcoin',
      quantity: 0.5,
      avg_price_usd: 50000,
      current_price_usd: 54000,
      current_value_sll: usdToLeone(27000),
      pnl_percent: 8.0,
      pnl_sll: usdToLeone(2000),
    },
  ];

  const data = portfolioData || mockData;
  const displayHoldings = holdings.length > 0 ? holdings : mockHoldings;

  if (loading) {
    return (
      <div className={styles.portfolio}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.portfolio}>
      <header className={styles.header}>
        <div>
          <h1>Portfolio</h1>
          <p className={styles.subtitle}>Manage your digital assets in SLL (Leone)</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.btnSecondary} onClick={() => setShowWithdrawModal(true)}>
            <span>📤</span> Withdraw
          </button>
          <button className={styles.btnPrimary} onClick={() => setShowDepositModal(true)}>
            <span>💰</span> Deposit
          </button>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️</span> {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Value (SLL)</span>
            <span className={styles.statIcon}>💼</span>
          </div>
          <h2 className={styles.statValue}>{formatLeone(data.total_value_sll)}</h2>
          <p className={styles.statChange}>
            <span className={styles.positive}>
              {formatLeone(data.total_profit_sll)} ({data.daily_change_percent}%)
            </span>
            <span className={styles.statPeriod}>Overall Gain/Loss</span>
          </p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Cash Balance</span>
            <span className={styles.statIcon}>💵</span>
          </div>
          <h2 className={styles.statValue}>{formatLeone(data.cash_balance_sll)}</h2>
          <p className={styles.statChange}>
            <span className={styles.neutral}>Available to trade</span>
            <span className={styles.statPeriod}>Buying Power</span>
          </p>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Daily Change</span>
            <span className={styles.statIcon}>📊</span>
          </div>
          <h2 className={styles.statValue}>{formatPercent(data.daily_change_percent)}</h2>
          <p className={styles.statChange}>
            <span className={styles.positive}>↗ Today's Profit</span>
            <span className={styles.statPeriod}>Past 24 Hours</span>
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className={styles.holdingsSection}>
        <div className={styles.sectionHeader}>
          <h3>Holdings</h3>
          <button className={styles.refreshBtn} onClick={fetchPortfolioData}>
            <span>🔄</span> Refresh
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Quantity</th>
                <th>Avg Price (USD)</th>
                <th>Current Value (SLL)</th>
                <th>P&L</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayHoldings.map((holding, index) => (
                <tr key={index}>
                  <td>
                    <div className={styles.assetCell}>
                      <div className={styles.assetIcon}>💎</div>
                      <div>
                        <p className={styles.assetName}>{holding.name}</p>
                        <p className={styles.assetSymbol}>{holding.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td>{holding.quantity}</td>
                  <td>{formatUSD(holding.avg_price_usd)}</td>
                  <td className={styles.valueCell}>{formatLeone(holding.current_value_sll)}</td>
                  <td>
                    <span className={holding.pnl_percent >= 0 ? styles.positive : styles.negative}>
                      {formatPercent(holding.pnl_percent)}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => {
                          setSelectedAsset(holding);
                          setShowTradeModal(true);
                          setError('');
                        }}
                      >
                        Trade
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <div className={styles.modal} onClick={() => !tradeLoading && setShowTradeModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>Trade {selectedAsset?.name}</h2>
            {error && <div className={styles.modalError}>{error}</div>}
            <div className={styles.formGroup}>
              <label>Action</label>
              <select
                value={tradeForm.action}
                onChange={e => setTradeForm({ ...tradeForm, action: e.target.value })}
                className={styles.input}
                disabled={tradeLoading}
              >
                <option value="BUY">Buy</option>
                <option value="SELL">Sell</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Quantity</label>
              <input
                type="number"
                step="0.00000001"
                value={tradeForm.quantity}
                onChange={e => setTradeForm({ ...tradeForm, quantity: e.target.value })}
                placeholder="Enter quantity"
                className={styles.input}
                disabled={tradeLoading}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.btnSecondary}
                onClick={() => setShowTradeModal(false)}
                disabled={tradeLoading}
              >
                Cancel
              </button>
              <button className={styles.btnPrimary} onClick={executeTrade} disabled={tradeLoading}>
                {tradeLoading ? 'Executing...' : 'Execute Trade'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className={styles.modal} onClick={() => !depositLoading && setShowDepositModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>💰 Deposit Funds</h2>
            {error && <div className={styles.modalError}>{error}</div>}
            <div className={styles.formGroup}>
              <label>Amount (SLL — Sierra Leone Leone)</label>
              <input
                type="number"
                value={depositForm.amount}
                onChange={e => setDepositForm({ ...depositForm, amount: e.target.value })}
                placeholder="e.g. 100000"
                className={styles.input}
                disabled={depositLoading}
              />
              {depositForm.amount && (
                <small className={styles.inputHint}>
                  ≈ ${(parseFloat(depositForm.amount || 0) / 23700).toFixed(2)} USD
                </small>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Payment Method</label>
              <select
                value={depositForm.method}
                onChange={e =>
                  setDepositForm({ ...depositForm, method: e.target.value, detail: '' })
                }
                className={styles.input}
                disabled={depositLoading}
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>
                {getPaymentMethod(depositForm.method)?.type === 'mobile'
                  ? 'Phone Number'
                  : getPaymentMethod(depositForm.method)?.type === 'email'
                    ? 'PayPal Email'
                    : 'Card Last 4 Digits'}
              </label>
              <input
                type={getPaymentMethod(depositForm.method)?.type === 'email' ? 'email' : 'text'}
                value={depositForm.detail}
                onChange={e => setDepositForm({ ...depositForm, detail: e.target.value })}
                placeholder={getPaymentMethod(depositForm.method)?.placeholder}
                className={styles.input}
                disabled={depositLoading}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.btnSecondary}
                onClick={() => setShowDepositModal(false)}
                disabled={depositLoading}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={handleDeposit}
                disabled={depositLoading}
              >
                {depositLoading ? '⏳ Processing...' : '✅ Deposit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div
          className={styles.modal}
          onClick={() => !withdrawLoading && setShowWithdrawModal(false)}
        >
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2>📤 Withdraw Funds</h2>
            {error && <div className={styles.modalError}>{error}</div>}
            <div className={styles.formGroup}>
              <label>Amount (SLL — Sierra Leone Leone)</label>
              <input
                type="number"
                value={withdrawForm.amount}
                onChange={e => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                placeholder="e.g. 50000"
                className={styles.input}
                disabled={withdrawLoading}
              />
              {withdrawForm.amount && (
                <small className={styles.inputHint}>
                  ≈ ${(parseFloat(withdrawForm.amount || 0) / 23700).toFixed(2)} USD
                </small>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Payment Method</label>
              <select
                value={withdrawForm.method}
                onChange={e =>
                  setWithdrawForm({ ...withdrawForm, method: e.target.value, account: '' })
                }
                className={styles.input}
                disabled={withdrawLoading}
              >
                {PAYMENT_METHODS.map(m => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Account Details</label>
              <input
                type="text"
                value={withdrawForm.account}
                onChange={e => setWithdrawForm({ ...withdrawForm, account: e.target.value })}
                placeholder={
                  getPaymentMethod(withdrawForm.method)?.placeholder || 'Enter destination'
                }
                className={styles.input}
                disabled={withdrawLoading}
              />
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.btnSecondary}
                onClick={() => setShowWithdrawModal(false)}
                disabled={withdrawLoading}
              >
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                onClick={handleWithdraw}
                disabled={withdrawLoading}
              >
                {withdrawLoading ? '⏳ Processing...' : '📤 Withdraw'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className={styles.modal} onClick={() => setShowSuccessModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.successIcon}>✅</div>
            <h2>Success!</h2>
            <p className={styles.successMessage}>{successMessage}</p>
            <button className={styles.btnPrimary} onClick={() => setShowSuccessModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
