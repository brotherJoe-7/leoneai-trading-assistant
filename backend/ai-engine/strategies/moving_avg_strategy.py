from .base_strategy import BaseStrategy

class MovingAverageStrategy(BaseStrategy):
    """Moving average crossover strategy"""
    
    def __init__(self):
        super().__init__(name="Moving Average Strategy", confidence_threshold=70.0)
        self.fast_period = 20
        self.slow_period = 50
    
    def evaluate(self, data, indicators):
        """Evaluate using moving average crossovers"""
        fast_ma_key = f'ma_{self.fast_period}'
        slow_ma_key = f'ma_{self.slow_period}'
        
        if fast_ma_key not in indicators.columns or slow_ma_key not in indicators.columns:
            return None
        
        latest_fast = indicators[fast_ma_key].iloc[-1]
        latest_slow = indicators[slow_ma_key].iloc[-1]
        prev_fast = indicators[fast_ma_key].iloc[-2] if len(indicators) > 1 else latest_fast
        prev_slow = indicators[slow_ma_key].iloc[-2] if len(indicators) > 1 else latest_slow
        
        symbol = data['symbol'].iloc[-1] if 'symbol' in data.columns else "UNKNOWN"
        
        # Golden cross (fast crosses above slow)
        if prev_fast <= prev_slow and latest_fast > latest_slow:
            crossover_strength = (latest_fast - latest_slow) / latest_slow if latest_slow != 0 else 0
            confidence = self.calculate_confidence(abs(crossover_strength))
            
            if confidence >= self.confidence_threshold:
                return self.create_signal(
                    symbol=symbol,
                    action="BUY",
                    confidence=confidence,
                    reason=f"Golden cross ({self.fast_period}MA > {self.slow_period}MA)"
                )
        
        # Death cross (fast crosses below slow)
        elif prev_fast >= prev_slow and latest_fast < latest_slow:
            crossover_strength = (latest_slow - latest_fast) / latest_fast if latest_fast != 0 else 0
            confidence = self.calculate_confidence(abs(crossover_strength))
            
            if confidence >= self.confidence_threshold:
                return self.create_signal(
                    symbol=symbol,
                    action="SELL",
                    confidence=confidence,
                    reason=f"Death cross ({self.fast_period}MA < {self.slow_period}MA)"
                )
        
        return None