import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatLeone, formatUSD } from '../../utils/formatters';
import { subscriptionAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Subscription.module.css';

const Subscription = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Orange Money');
  const [paymentDetail, setPaymentDetail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const PAYMENT_METHODS_SUB = [
    { value: 'Orange Money', label: '🇸🇱 Orange Money', hint: 'Enter mobile number (+232...)' },
    { value: 'Afrimoney', label: '🇸🇱 Afrimoney', hint: 'Enter Afrimoney number' },
    { value: 'PayPal', label: '💳 PayPal', hint: 'Enter PayPal email' },
    { value: 'Stripe', label: '💳 Stripe', hint: 'Enter card last 4 digits' },
    { value: 'Visa/Mastercard', label: '💳 Visa / Mastercard', hint: 'Enter card last 4 digits' },
  ];
  const getSubPM = val => PAYMENT_METHODS_SUB.find(m => m.value === val) || PAYMENT_METHODS_SUB[0];

  // Current user plan
  const currentPlan = user?.plan_type?.toLowerCase() || 'free';

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await subscriptionAPI.getCurrentSubscription();
        setActiveSubscription(data);
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, []);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: '🌱',
      priceUSD: 0,
      priceSLL: 0,
      description: 'Perfect for beginners exploring trading',
      features: [
        'Basic market data',
        'Limited signals (5 per week)',
        'Portfolio tracking',
        'Basic charts',
        'Community support',
      ],
      limitations: ['No advanced signals', 'No copy trading', 'Limited market access'],
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: '⚡',
      priceUSD: 29.99,
      priceSLL: 710.77,
      description: 'For serious traders who want more',
      features: [
        'Real-time market data',
        'Unlimited signals',
        'Advanced analytics',
        'Priority support',
        'Copy top traders',
        'Advanced charts & indicators',
        'Mobile app access',
        'Email alerts',
      ],
      limitations: [],
      popular: true,
      savings: billingCycle === 'yearly' ? '20%' : null,
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: '💎',
      priceUSD: 99.99,
      priceSLL: 2369.77,
      description: 'For professional traders & institutions',
      features: [
        'Everything in Pro',
        'AI-powered trading bot',
        'Dedicated account manager',
        '24/7 priority support',
        'Custom signals',
        'API access',
        'Advanced risk management',
        'Tax reporting tools',
        'Institutional-grade security',
      ],
      limitations: [],
      popular: false,
      savings: billingCycle === 'yearly' ? '25%' : null,
    },
  ];

  const getPrice = plan => {
    if (plan.priceUSD === 0) return { usd: 0, sll: 0 };

    let priceUSD = plan.priceUSD;
    if (billingCycle === 'yearly') {
      const discount = plan.id === 'premium' ? 0.25 : 0.2;
      priceUSD = priceUSD * 12 * (1 - discount);
    }

    return {
      usd: priceUSD,
      sll: priceUSD * 23.7,
    };
  };

  const handleUpgrade = plan => {
    if (plan.id === currentPlan) return;
    if (plan.id === 'free') return;

    setSelectedPlan(plan);
    setShowUpgradeModal(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!paymentDetail) {
      alert('Please enter your payment details');
      return;
    }

    setProcessing(true);

    try {
      const result = await subscriptionAPI.upgradeSubscription(selectedPlan.name.toUpperCase());

      setTimeout(() => {
        setProcessing(false);
        setShowUpgradeModal(false);
        setSuccessMsg(
          `🎉 Upgraded to ${selectedPlan.name}! Payment via ${paymentMethod} initiated.`
        );
        setPaymentDetail('');

        // Update user plan in context without full reload
        updateUser({ plan_type: selectedPlan.name.toUpperCase() });
      }, 1200);
    } catch (error) {
      setProcessing(false);
      alert('Upgrade failed: ' + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className={styles.subscription}>
      <header className={styles.header}>
        <h1>Upgrade Your Plan</h1>
        <p className={styles.subtitle}>Choose the perfect plan for your trading journey</p>
      </header>

      {/* Billing Cycle Toggle */}
      <div className={styles.billingToggle}>
        <button
          className={`${styles.cycleBtn} ${billingCycle === 'monthly' ? styles.active : ''}`}
          onClick={() => setBillingCycle('monthly')}
        >
          Monthly
        </button>
        <button
          className={`${styles.cycleBtn} ${billingCycle === 'yearly' ? styles.active : ''}`}
          onClick={() => setBillingCycle('yearly')}
        >
          Yearly
          <span className={styles.savingsBadge}>Save up to 25%</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className={styles.plansGrid}>
        {plans.map(plan => {
          const price = getPrice(plan);
          const isCurrent = plan.id === currentPlan;

          return (
            <div
              key={plan.id}
              className={`${styles.planCard} ${plan.popular ? styles.popular : ''} ${isCurrent ? styles.current : ''}`}
            >
              {plan.popular && <div className={styles.popularBadge}>Most Popular</div>}

              <div className={styles.planHeader}>
                <div className={styles.planIcon}>{plan.icon}</div>
                <h2>{plan.name}</h2>
                <p className={styles.planDescription}>{plan.description}</p>
              </div>

              <div className={styles.pricing}>
                {plan.priceUSD === 0 ? (
                  <div className={styles.freePrice}>Free</div>
                ) : (
                  <>
                    <div className={styles.priceMain}>
                      {formatLeone(price.sll)}
                      <span className={styles.pricePeriod}>
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    <div className={styles.priceUSD}>{formatUSD(price.usd)} USD</div>
                    {plan.savings && billingCycle === 'yearly' && (
                      <div className={styles.savings}>Save {plan.savings}</div>
                    )}
                  </>
                )}
              </div>

              <div className={styles.features}>
                <h3>Features</h3>
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index} className={styles.feature}>
                      <span className={styles.checkIcon}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <>
                    <h3 className={styles.limitationsTitle}>Limitations</h3>
                    <ul>
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className={styles.limitation}>
                          <span className={styles.crossIcon}>✗</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <button
                className={`${styles.upgradeBtn} ${isCurrent ? styles.currentBtn : ''}`}
                onClick={() => handleUpgrade(plan)}
                disabled={isCurrent || plan.id === 'free'}
              >
                {isCurrent ? 'Current Plan' : plan.id === 'free' ? 'Free Forever' : 'Upgrade Now'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className={styles.comparisonSection}>
        <h2>Feature Comparison</h2>
        <div className={styles.comparisonTable}>
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Pro</th>
                <th>Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Market Data</td>
                <td>Basic</td>
                <td>Real-time</td>
                <td>Real-time</td>
              </tr>
              <tr>
                <td>Signals per Week</td>
                <td>5</td>
                <td>Unlimited</td>
                <td>Unlimited + Custom</td>
              </tr>
              <tr>
                <td>Copy Trading</td>
                <td>✗</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>AI Trading Bot</td>
                <td>✗</td>
                <td>✗</td>
                <td>✓</td>
              </tr>
              <tr>
                <td>Support</td>
                <td>Community</td>
                <td>Priority</td>
                <td>24/7 Dedicated</td>
              </tr>
              <tr>
                <td>API Access</td>
                <td>✗</td>
                <td>✗</td>
                <td>✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Upgrade to {selectedPlan?.name}</h2>

            <div className={styles.modalPrice}>
              <p>Total Amount</p>
              <h3>{formatLeone(getPrice(selectedPlan).sll)}</h3>
              <p className={styles.modalPriceUSD}>{formatUSD(getPrice(selectedPlan).usd)} USD</p>
            </div>

            <div className={styles.paymentMethods}>
              <h3>Payment Method</h3>
              <div className={styles.methodButtons}>
                {PAYMENT_METHODS_SUB.map(m => (
                  <button
                    key={m.value}
                    className={`${styles.methodBtn} ${paymentMethod === m.value ? styles.active : ''}`}
                    onClick={() => {
                      setPaymentMethod(m.value);
                      setPaymentDetail('');
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>
                {paymentMethod.includes('PayPal')
                  ? 'PayPal Email'
                  : paymentMethod.includes('Stripe') || paymentMethod.includes('Visa')
                    ? 'Card Last 4 Digits'
                    : 'Mobile Number'}
              </label>
              <input
                type={paymentMethod.includes('PayPal') ? 'email' : 'text'}
                placeholder={getSubPM(paymentMethod).hint}
                className={styles.input}
                value={paymentDetail}
                onChange={e => setPaymentDetail(e.target.value)}
                disabled={processing}
              />
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setShowUpgradeModal(false);
                  setPaymentDetail('');
                }}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtn}
                onClick={handleConfirmUpgrade}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Confirm Upgrade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
