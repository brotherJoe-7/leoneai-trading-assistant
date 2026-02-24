import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

const TradeScreen = () => {
  const [tradeData, setTradeData] = useState({
    symbol: 'BTC-USD',
    action: 'BUY',
    quantity: '',
    orderType: 'MARKET',
    paymentMethod: 'CASH'
  });
  const [currentPrice, setCurrentPrice] = useState(45000);

  const handleTrade = () => {
    if (!tradeData.quantity || parseFloat(tradeData.quantity) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return;
    }

    const total = parseFloat(tradeData.quantity) * currentPrice;
    Alert.alert(
      'Confirm Trade',
      `${tradeData.action} ${tradeData.quantity} ${tradeData.symbol} at $${currentPrice.toLocaleString()}\nTotal: $${total.toLocaleString()} (Le ${(total * 22000).toLocaleString()})`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => executeTrade() }
      ]
    );
  };

  const executeTrade = () => {
    // TODO: API call
    Alert.alert('Success', 'Trade executed successfully!');
    setTradeData({ ...tradeData, quantity: '' });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trade</Text>
      </View>

      {/* Symbol Selection */}
      <View style={styles.card}>
        <Text style={styles.label}>Symbol</Text>
        <View style={styles.symbolButtons}>
          {['BTC-USD', 'ETH-USD', 'AAPL', 'GOOGL'].map((sym) => (
            <TouchableOpacity
              key={sym}
              style={[styles.symbolBtn, tradeData.symbol === sym && styles.symbolBtnActive]}
              onPress={() => setTradeData({ ...tradeData, symbol: sym })}
            >
              <Text style={[styles.symbolBtnText, tradeData.symbol === sym && styles.symbolBtnTextActive]}>
                {sym}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Current Price */}
      <View style={styles.card}>
        <Text style={styles.label}>Current Price</Text>
        <Text style={styles.price}>${currentPrice.toLocaleString()}</Text>
        <Text style={styles.priceLeone}>Le {(currentPrice * 22000).toLocaleString()}</Text>
      </View>

      {/* Buy/Sell Toggle */}
      <View style={styles.card}>
        <Text style={styles.label}>Action</Text>
        <View style={styles.actionToggle}>
          <TouchableOpacity
            style={[styles.actionBtn, tradeData.action === 'BUY' && styles.buyBtn]}
            onPress={() => setTradeData({ ...tradeData, action: 'BUY' })}
          >
            <Text style={[styles.actionBtnText, tradeData.action === 'BUY' && styles.actionBtnTextActive]}>
              BUY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, tradeData.action === 'SELL' && styles.sellBtn]}
            onPress={() => setTradeData({ ...tradeData, action: 'SELL' })}
          >
            <Text style={[styles.actionBtnText, tradeData.action === 'SELL' && styles.actionBtnTextActive]}>
              SELL
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quantity Input */}
      <View style={styles.card}>
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          value={tradeData.quantity}
          onChangeText={(text) => setTradeData({ ...tradeData, quantity: text })}
          keyboardType="decimal-pad"
          placeholder="0.00"
        />
        {tradeData.quantity && (
          <Text style={styles.totalText}>
            Total: ${(parseFloat(tradeData.quantity) * currentPrice).toLocaleString()}
          </Text>
        )}
      </View>

      {/* Payment Method */}
      <View style={styles.card}>
        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.paymentMethods}>
          {[
            { value: 'CASH', label: '💵 Cash', icon: '💵' },
            { value: 'ORANGE_MONEY', label: '🍊 Orange Money', icon: '🍊' },
            { value: 'AFRICELL_MONEY', label: '📱 Africell Money', icon: '📱' }
          ].map((method) => (
            <TouchableOpacity
              key={method.value}
              style={[
                styles.paymentBtn,
                tradeData.paymentMethod === method.value && styles.paymentBtnActive
              ]}
              onPress={() => setTradeData({ ...tradeData, paymentMethod: method.value })}
            >
              <Text style={styles.paymentBtnText}>{method.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Execute Button */}
      <TouchableOpacity style={styles.executeBtn} onPress={handleTrade}>
        <Text style={styles.executeBtnText}>
          {tradeData.action} {tradeData.symbol}
        </Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '600',
  },
  symbolButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symbolBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  symbolBtnActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  symbolBtnText: {
    fontWeight: '600',
    color: '#1a1a1a',
  },
  symbolBtnTextActive: {
    color: '#fff',
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  priceLeone: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  actionToggle: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  buyBtn: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  sellBtn: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  actionBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1a1a1a',
  },
  actionBtnTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
  },
  totalText: {
    marginTop: 12,
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  paymentMethods: {
    gap: 12,
  },
  paymentBtn: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  paymentBtnActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  paymentBtnText: {
    fontWeight: '600',
    fontSize: 16,
  },
  executeBtn: {
    backgroundColor: '#667eea',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  executeBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TradeScreen;
