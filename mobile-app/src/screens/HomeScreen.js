import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [signals, setSignals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // TODO: Replace with actual API calls
    const mockPortfolio = {
      totalValue: 125000,
      totalValueLeone: 2750000000,
      dailyPnl: 1250.50,
      dailyPnlPercent: 1.01
    };

    const mockSignals = [
      { id: 1, symbol: 'BTC-USD', action: 'BUY', confidence: 85.5, price: 45000 },
      { id: 2, symbol: 'ETH-USD', action: 'HOLD', confidence: 65.0, price: 3200 }
    ];

    setPortfolio(mockPortfolio);
    setSignals(mockSignals);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Welcome Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.dateText}>{new Date().toLocaleDateString()}</Text>
      </View>

      {/* Portfolio Summary Card */}
      <View style={styles.portfolioCard}>
        <Text style={styles.cardTitle}>Portfolio Value</Text>
        <Text style={styles.portfolioValue}>${portfolio?.totalValue.toLocaleString()}</Text>
        <Text style={styles.portfolioValueLeone}>Le {portfolio?.totalValueLeone.toLocaleString()}</Text>
        
        <View style={styles.pnlContainer}>
          <Text style={[styles.pnlText, portfolio?.dailyPnl >= 0 ? styles.profit : styles.loss]}>
            {portfolio?.dailyPnl >= 0 ? '+' : ''}${portfolio?.dailyPnl.toFixed(2)}
          </Text>
          <Text style={[styles.pnlPercent, portfolio?.dailyPnl >= 0 ? styles.profit : styles.loss]}>
            ({portfolio?.dailyPnlPercent >= 0 ? '+' : ''}{portfolio?.dailyPnlPercent.toFixed(2)}%)
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryAction]}
          onPress={() => navigation.navigate('Trade')}
        >
          <Text style={styles.actionIcon}>💱</Text>
          <Text style={styles.actionText}>Trade</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Portfolio')}
        >
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>Portfolio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Signals')}
        >
          <Text style={styles.actionIcon}>🎯</Text>
          <Text style={styles.actionText}>Signals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Learn')}
        >
          <Text style={styles.actionIcon}>📚</Text>
          <Text style={styles.actionText}>Learn</Text>
        </TouchableOpacity>
      </View>

      {/* AI Signals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Trading Signals</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signals')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {signals.map((signal) => (
          <View key={signal.id} style={styles.signalCard}>
            <View style={styles.signalHeader}>
              <Text style={styles.signalSymbol}>{signal.symbol}</Text>
              <View style={[
                styles.actionBadge,
                signal.action === 'BUY' ? styles.buyBadge : signal.action === 'SELL' ? styles.sellBadge : styles.holdBadge
              ]}>
                <Text style={styles.actionBadgeText}>{signal.action}</Text>
              </View>
            </View>
            <Text style={styles.signalPrice}>${signal.price.toLocaleString()}</Text>
            <Text style={styles.signalConfidence}>Confidence: {signal.confidence}%</Text>
          </View>
        ))}
      </View>

      {/* Mobile Money Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoIcon}>🇸🇱</Text>
        <Text style={styles.infoTitle}>Sierra Leone Trading</Text>
        <Text style={styles.infoText}>
          Trade with Orange Money & Africell Money
        </Text>
        <Text style={styles.infoText}>
          1 USD = 22,000 SLL
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#667eea',
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  dateText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  portfolioCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  portfolioValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  portfolioValueLeone: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  pnlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  pnlText: {
    fontSize: 18,
    fontWeight: '600',
  },
  pnlPercent: {
    fontSize: 14,
    marginLeft: 8,
  },
  profit: {
    color: '#10b981',
  },
  loss: {
    color: '#ef4444',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  primaryAction: {
    backgroundColor: '#667eea',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  viewAll: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  signalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  signalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  signalSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  actionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  buyBadge: {
    backgroundColor: '#d1fae5',
  },
  sellBadge: {
    backgroundColor: '#fee2e2',
  },
  holdBadge: {
    backgroundColor: '#e5e7eb',
  },
  actionBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  signalPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  signalConfidence: {
    fontSize: 14,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#667eea',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default HomeScreen;
