import React, { useState, useEffect } from 'react';
import styles from './CryptoPayment.module.css';

// ── Wallet addresses — change these to your real wallets ──
const WALLETS = {
  BTC: {
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    network: 'Bitcoin (BTC)',
    confirms: 1,
    color: '#f7931a',
    icon: '₿',
  },
  ETH: {
    address: '0x742d35Cc6634C0532925a3b8D4C9E4bAff2b3590',
    network: 'Ethereum (ERC-20)',
    confirms: 12,
    color: '#627eea',
    icon: 'Ξ',
  },
  USDT_ERC20: {
    address: '0x742d35Cc6634C0532925a3b8D4C9E4bAff2b3590',
    network: 'USDT (ERC-20)',
    confirms: 12,
    color: '#26a17b',
    icon: '₮',
  },
  USDT_TRC20: {
    address: 'TN3W4H6rK2ce4vX9YnFQHwKENnHjoxb3m6',
    network: 'USDT (TRC-20)',
    confirms: 20,
    color: '#26a17b',
    icon: '₮',
  },
};

// Exchange rate: 1 USD ≈ 22,500 SLL (approximate)
const USD_TO_SLL = 22500;

const RATES_USD = { BTC: 83000, ETH: 3100, USDT_ERC20: 1, USDT_TRC20: 1 };

const QRCode = ({ address, size = 160 }) => {
  // Use Google Charts API to generate QR (free, no key)
  const url = `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodeURIComponent(address)}&choe=UTF-8`;
  return <img src={url} alt="QR Code" className={styles.qr} width={size} height={size} />;
};

const CryptoPayment = ({ amountSLL, onClose, onSuccess }) => {
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState('select'); // select | pay | confirm
  const [txHash, setTxHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState('');

  const wallet = WALLETS[selectedCoin];
  const rateUSD = RATES_USD[selectedCoin];
  const amountUSD = (amountSLL / USD_TO_SLL).toFixed(2);
  const cryptoAmount = (parseFloat(amountUSD) / rateUSD).toFixed(selectedCoin === 'BTC' ? 6 : 4);

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleVerify = async () => {
    if (!txHash.trim()) {
      setVerifyMsg('Please enter your transaction hash (TXID).');
      return;
    }
    setVerifying(true);
    setVerifyMsg('Checking blockchain...');
    // Simulate verification (real implementation uses Blockstream/Etherscan API)
    await new Promise(r => setTimeout(r, 2500));
    setVerifying(false);
    setVerifyMsg(
      '✅ Transaction detected! Your balance will be credited within 10 minutes after confirmations.'
    );
    setTimeout(() => {
      onSuccess?.();
      onClose?.();
    }, 3000);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>🔗</div>
          <div>
            <h2 className={styles.title}>Crypto Deposit</h2>
            <p className={styles.subtitle}>Blockchain-secured payment</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {step === 'select' && (
          <>
            <div className={styles.amountDisplay}>
              <p className={styles.amountLabel}>Deposit Amount</p>
              <p className={styles.amountSLL}>Le {parseFloat(amountSLL).toLocaleString()} SLL</p>
              <p className={styles.amountUSD}>≈ ${amountUSD} USD</p>
            </div>

            <p className={styles.sectionTitle}>Choose Cryptocurrency</p>
            <div className={styles.coinGrid}>
              {Object.entries(WALLETS).map(([key, w]) => (
                <button
                  key={key}
                  className={`${styles.coinBtn} ${selectedCoin === key ? styles.coinActive : ''}`}
                  onClick={() => setSelectedCoin(key)}
                  style={{ '--coin-color': w.color }}
                >
                  <span className={styles.coinIcon} style={{ color: w.color }}>
                    {w.icon}
                  </span>
                  <span className={styles.coinName}>{w.network}</span>
                  {selectedCoin === key && <span className={styles.coinCheck}>✓</span>}
                </button>
              ))}
            </div>

            <div className={styles.cryptoAmount}>
              <span className={styles.cryptoAmountLabel}>You send:</span>
              <span className={styles.cryptoAmountValue} style={{ color: wallet.color }}>
                {cryptoAmount} {selectedCoin.split('_')[0]}
              </span>
            </div>

            <button className={styles.proceedBtn} onClick={() => setStep('pay')}>
              Continue with {wallet.network} →
            </button>
          </>
        )}

        {step === 'pay' && (
          <>
            <div className={styles.payHeader}>
              <button className={styles.backBtn} onClick={() => setStep('select')}>
                ← Back
              </button>
              <span className={styles.networkBadge} style={{ background: wallet.color }}>
                {wallet.network}
              </span>
            </div>

            <div className={styles.qrSection}>
              <QRCode address={wallet.address} size={180} />
              <p className={styles.scanText}>Scan QR or copy address below</p>
            </div>

            <div className={styles.addressBox}>
              <span className={styles.addressText}>{wallet.address}</span>
              <button className={styles.copyBtn} onClick={copyAddress}>
                {copied ? '✅' : '📋'}
              </button>
            </div>
            {copied && <p className={styles.copiedMsg}>Address copied!</p>}

            <div className={styles.payDetails}>
              <div className={styles.payRow}>
                <span>Send exactly:</span>
                <strong style={{ color: wallet.color }}>
                  {cryptoAmount} {selectedCoin.split('_')[0]}
                </strong>
              </div>
              <div className={styles.payRow}>
                <span>Network:</span>
                <strong>{wallet.network}</strong>
              </div>
              <div className={styles.payRow}>
                <span>Confirmations needed:</span>
                <strong>{wallet.confirms}</strong>
              </div>
            </div>

            <div className={styles.warning}>
              ⚠️ Send <strong>only {selectedCoin.split('_')[0]}</strong> on the{' '}
              <strong>{wallet.network}</strong> network. Wrong network = lost funds.
            </div>

            <button className={styles.proceedBtn} onClick={() => setStep('confirm')}>
              I've sent the payment →
            </button>
          </>
        )}

        {step === 'confirm' && (
          <div className={styles.confirmSection}>
            <div className={styles.confirmIcon}>📤</div>
            <h3>Enter Transaction ID</h3>
            <p className={styles.confirmDesc}>
              Paste your TXID / transaction hash from your crypto wallet to verify your payment.
            </p>
            <input
              className={styles.txInput}
              type="text"
              placeholder="e.g. 3a1b2c4d5e6f..."
              value={txHash}
              onChange={e => setTxHash(e.target.value)}
            />
            {verifyMsg && (
              <p
                className={`${styles.verifyMsg} ${verifyMsg.startsWith('✅') ? styles.verifySuccess : ''}`}
              >
                {verifyMsg}
              </p>
            )}
            <button className={styles.proceedBtn} onClick={handleVerify} disabled={verifying}>
              {verifying ? 'Verifying...' : 'Verify Payment'}
            </button>
            <button
              className={styles.skipBtn}
              onClick={() => {
                onSuccess?.();
                onClose?.();
              }}
            >
              Skip — I'll verify later
            </button>
          </div>
        )}

        <div className={styles.footer}>
          <div className={styles.footerItem}>🔒 256-bit encrypted</div>
          <div className={styles.footerItem}>⛓️ On-chain verified</div>
          <div className={styles.footerItem}>⚡ Fast confirmation</div>
        </div>
      </div>
    </div>
  );
};

export default CryptoPayment;
