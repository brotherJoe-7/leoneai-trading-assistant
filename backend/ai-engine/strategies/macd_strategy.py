from .base_strategy import BaseStrategy

class MACDStrategy(BaseStrategy):
    """MACD-based trading strategy"""
    
    def __init__(self):
        super().__init__(name="MACD Strategy", confidence_threshold=70.0)
    
    def evaluate(self, data, indicators):
        """Evaluate using MACD indicator"""
        if 'macd' not in indicators.columns or 'macd_signal' not in indicators.columns:
            return None
        
        latest_macd = indicators['macd'].iloc[-1]
        latest_signal = indicators['macd_signal'].iloc[-1]
        prev_macd = indicators['macd'].iloc[-2] if len(indicators) > 1 else latest_macd
        prev_signal = indicators['macd_signal'].iloc[-2] if len(indicators) > 1 else latest_signal
        
        symbol = data['symbol'].iloc[-1] if 'symbol' in data.columns else "UNKNOWN"
        
        # MACD crossover detection
        if prev_macd <= prev_signal and latest_macd > latest_signal:
            # Bullish crossover
            crossover_strength = (latest_macd - latest_signal) / abs(latest_signal) if latest_signal != 0 else 0
            confidence = self.calculate_confidence(abs(crossover_strength))
            
            if confidence >= self.confidence_threshold:
                return self.create_signal(
                    symbol=symbol,
                    action="BUY",
                    confidence=confidence,
                    reason=f"MACD bullish crossover (MACD: {latest_macd:.4f}, Signal: {latest_signal:.4f})"
                )
        
        elif prev_macd >= prev_signal and latest_macd < latest_signal:
            # Bearish crossover
            crossover_strength = (latest_signal - latest_macd) / abs(latest_macd) if latest_macd != 0 else 0
            confidence = self.calculate_confidence(abs(crossover_strength))
            
            if confidence >= self.confidence_threshold:
                return self.create_signal(
                    symbol=symbol,
                    action="SELL",
                    confidence=confidence,
                    reason=f"MACD bearish crossover (MACD: {latest_macd:.4f}, Signal: {latest_signal:.4f})"
                )
        
        return None