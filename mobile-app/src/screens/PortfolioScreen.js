import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const PortfolioScreen = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = () => {
    // TODO: API call
    setPortfolio({
      totalValue: 125000,
      totalValueLeone: 2750000000,
      cashBalance: 25000,
      cashBalanceLeone: 550000000,
      totalPnl: 25000,
      totalPnlPercent: 25.0
    });

    setPositions([
      { id: 1, symbol: 'BTC-USD', quantity: 0.5, avgPrice: 42000, currentPrice: 45000, pnl: 1500, pnlPercent: 7.14 },
      { id: 2, symbol: 'ETH-USD', quantity: 5.0, avgPrice: 2800, currentPrice: 3200, pnl: 2000, pnlPercent: 14.29 }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Portfolio</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Total Value</Text>
          <Text style={styles.cardValue}>${portfolio?.totalValue.toLocaleString()}</Text>
          <Text style={styles.cardSecondary}>Le {portfolio?.totalValueLeone.toLocaleString()}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardLabel}>Cash Balance</Text>
          <Text style={styles.cardValue}>${portfolio?.cashBalance.toLocaleString()}</Text>
          <Text style={styles.cardSecondary}>Le {portfolio?.cashBalanceLeone.toLocaleString()}</Text>
        </View>
      </View>

      {/* Positions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Positions</Text>
        {positions.map((position) => (
          <View key={position.id} style={styles.positionCard}>
            <View style={styles.positionHeader}>
              <Text style={styles.positionSymbol}>{position.symbol}</Text>
              <Text style={[styles.positionPnl, position.pnl >= 0 ? styles.profit : styles.loss]}>
                {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()}
              </Text>
            </View>
            <View style={styles.positionDetails}>
              <Text style={styles.positionText}>Qty: {position.quantity}</Text>
              <Text style={styles.positionText}>Avg: ${position.avgPrice.toLocaleString()}</Text>
              <Text style={styles.positionText}>Current: ${position.currentPrice.toLocaleString()}</Text>
            </View>
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
  summaryGrid: { padding: 16, gap: 12 },
  summaryCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  cardLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  cardValue: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  cardSecondary: { fontSize: 14, color: '#666', marginTop: 4 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  positionCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  positionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  positionSymbol: { fontSize: 16, fontWeight: 'bold', color: '#667eea' },
  positionPnl: { fontSize: 16, fontWeight: '600' },
  profit: { color: '#10b981' },
  loss: { color: '#ef4444' },
  positionDetails: { flexDirection: 'row', justifyContent: 'space-between' },
  positionText: { fontSize: 14, color: '#666' }
});

export default PortfolioScreen;
