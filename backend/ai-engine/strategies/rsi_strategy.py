from .base_strategy import BaseStrategy

class RSIStrategy(BaseStrategy):
    """RSI-based trading strategy"""
    
    def __init__(self):
        super().__init__(name="RSI Strategy", confidence_threshold=70.0)
        self.oversold_threshold = 30
        self.overbought_threshold = 70
    
    def evaluate(self, data, indicators):
        """Evaluate using RSI indicator"""
        if 'rsi' not in indicators.columns:
            return None
        
        latest_rsi = indicators['rsi'].iloc[-1]
        symbol = data['symbol'].iloc[-1] if 'symbol' in data.columns else "UNKNOWN"
        
        if latest_rsi < self.oversold_threshold:
            confidence = self.calculate_confidence(
                (self.oversold_threshold - latest_rsi) / self.oversold_threshold
            )
            if confidence >= self.confidence_threshold:
                return self.create_signal(
                    symbol=symbol,
                    action="BUY",
                    confidence=confidence,
                    reason=f"RSI oversold at {latest_rsi:.2f}"
                )
        
        elif latest_rsi > self.overbought_threshold:
            confidence = self.calculate_confidence(
                (latest_rsi - self.overbought_threshold) / (100 - self.overbought_threshold)
            )
            if confidence >= self.confidence_threshold:
                return self.create_signal(
                    symbol=symbol,
                    action="SELL",
                    confidence=confidence,
                    reason=f"RSI overbought at {latest_rsi:.2f}"
                )
        
        return None