import pandas as pd
import numpy as np

class PatternRecognizer:
    """Recognize chart patterns"""
    
    @staticmethod
    def recognize_candlestick_patterns(df: pd.DataFrame) -> list:
        """Recognize candlestick patterns"""
        patterns = []
        
        if len(df) < 3:
            return patterns
        
        # Check for doji
        body_size = abs(df['Close'].iloc[-1] - df['Open'].iloc[-1])
        total_range = df['High'].iloc[-1] - df['Low'].iloc[-1]
        
        if total_range > 0 and body_size / total_range < 0.1:
            patterns.append("DOJI")
        
        # Check for hammer
        if len(df) >= 2:
            prev_close = df['Close'].iloc[-2]
            current_close = df['Close'].iloc[-1]
            
            # Bullish engulfing
            if (df['Open'].iloc[-2] > df['Close'].iloc[-2] and  # Previous bearish
                df['Open'].iloc[-1] < df['Close'].iloc[-1] and  # Current bullish
                df['Open'].iloc[-1] < df['Close'].iloc[-2] and  # Current open < previous close
                df['Close'].iloc[-1] > df['Open'].iloc[-2]):    # Current close > previous open
                patterns.append("BULLISH_ENGULFING")
        
        return patterns
    
    @staticmethod
    def find_support_resistance(df: pd.DataFrame, window: int = 20) -> dict:
        """Find support and resistance levels"""
        if len(df) < window:
            return {"support": [], "resistance": []}
        
        closes = df['Close'].values
        
        # Find local minima (support)
        support_levels = []
        for i in range(window, len(closes) - window):
            if closes[i] == min(closes[i-window:i+window]):
                support_levels.append(closes[i])
        
        # Find local maxima (resistance)
        resistance_levels = []
        for i in range(window, len(closes) - window):
            if closes[i] == max(closes[i-window:i+window]):
                resistance_levels.append(closes[i])
        
        return {
            "support": list(set(support_levels))[:5],  # Top 5 unique levels
            "resistance": list(set(resistance_levels))[:5]
        }