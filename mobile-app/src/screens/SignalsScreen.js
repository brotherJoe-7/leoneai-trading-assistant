import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const SignalsScreen = () => {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    loadSignals();
  }, []);

  const loadSignals = () => {
    // TODO: API call
    setSignals([
      { id: 1, symbol: 'BTC-USD', action: 'BUY', confidence: 85.5, price: 45000, targetPrice: 48000, stopLoss: 42000, strategy: 'RSI Strategy' },
      { id: 2, symbol: 'ETH-USD', action: 'HOLD', confidence: 65.0, price: 3200, targetPrice: 3400, stopLoss: 3000, strategy: 'MACD Strategy' },
      { id: 3, symbol: 'AAPL', action: 'SELL', confidence: 72.0, price: 195, targetPrice: 185, stopLoss: 200, strategy: 'Moving Average' }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Trading Signals</Text>
        <Text style={styles.subtitle}>Real-time AI-powered recommendations</Text>
      </View>

      <View style={styles.signalsList}>
        {signals.map((signal) => (
          <View key={signal.id} style={styles.signalCard}>
            <View style={styles.signalHeader}>
              <Text style={styles.signalSymbol}>{signal.symbol}</Text>
              <View style={[
                styles.actionBadge,
                signal.action === 'BUY' ? styles.buyBadge : signal.action === 'SELL' ? styles.sellBadge : styles.holdBadge
              ]}>
                <Text style={styles.actionText}>{signal.action}</Text>
              </View>
            </View>

            <View style={styles.confidenceBar}>
              <Text style={styles.confidenceLabel}>Confidence: {signal.confidence}%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${signal.confidence}%` }]} />
              </View>
            </View>

            <View style={styles.priceInfo}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Current</Text>
                <Text style={styles.priceValue}>${signal.price.toLocaleString()}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Target</Text>
                <Text style={[styles.priceValue, styles.target]}>${signal.targetPrice.toLocaleString()}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Stop Loss</Text>
                <Text style={[styles.priceValue, styles.stopLoss]}>${signal.stopLoss.toLocaleString()}</Text>
              </View>
            </View>

            <Text style={styles.strategy}>Strategy: {signal.strategy}</Text>

            <TouchableOpacity style={styles.tradeBtn}>
              <Text style={styles.tradeBtnText}>Trade Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#667eea', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 4 },
  signalsList: { padding: 16 },
  signalCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 16 },
  signalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  signalSymbol: { fontSize: 18, fontWeight: 'bold', color: '#667eea' },
  actionBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  buyBadge: { backgroundColor: '#d1fae5' },
  sellBadge: { backgroundColor: '#fee2e2' },
  holdBadge: { backgroundColor: '#e5e7eb' },
  actionText: { fontWeight: 'bold', fontSize: 14 },
  confidenceBar: { marginBottom: 16 },
  confidenceLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  progressBar: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#667eea' },
  priceInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  priceItem: { alignItems: 'center' },
  priceLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  priceValue: { fontSize: 16, fontWeight: '600' },
  target: { color: '#10b981' },
  stopLoss: { color: '#ef4444' },
  strategy: { fontSize: 14, color: '#666', marginBottom: 16 },
  tradeBtn: { backgroundColor: '#667eea', padding: 16, borderRadius: 8, alignItems: 'center' },
  tradeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default SignalsScreen;
