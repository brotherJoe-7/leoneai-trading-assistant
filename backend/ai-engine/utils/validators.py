import pandas as pd
from typing import Any, Dict

class Validators:
    """Data validation utilities"""
    
    @staticmethod
    def validate_market_data(data: pd.DataFrame) -> bool:
        """Validate market data structure"""
        if data.empty:
            return False
        
        required_columns = ['Open', 'High', 'Low', 'Close']
        if not all(col in data.columns for col in required_columns):
            return False
        
        # Check for NaN values in required columns
        for col in required_columns:
            if data[col].isna().any():
                return False
        
        return True
    
    @staticmethod
    def validate_signal(signal: Dict[str, Any]) -> bool:
        """Validate trading signal structure"""
        required_fields = ['symbol', 'action', 'confidence', 'strategy']
        if not all(field in signal for field in required_fields):
            return False
        
        # Validate action
        valid_actions = ['BUY', 'SELL', 'HOLD', 'STRONG_BUY', 'STRONG_SELL']
        if signal['action'] not in valid_actions:
            return False
        
        # Validate confidence (0-100)
        confidence = signal['confidence']
        if not isinstance(confidence, (int, float)) or confidence < 0 or confidence > 100:
            return False
        
        return True
    
    @staticmethod
    def validate_price(price: float) -> bool:
        """Validate price value"""
        return isinstance(price, (int, float)) and price > 0