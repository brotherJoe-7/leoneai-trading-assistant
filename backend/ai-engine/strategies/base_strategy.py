from abc import ABC, abstractmethod
from datetime import datetime

class BaseStrategy(ABC):
    """Base class for all trading strategies"""
    
    def __init__(self, name: str, confidence_threshold: float = 70.0):
        self.name = name
        self.confidence_threshold = confidence_threshold
    
    @abstractmethod
    def evaluate(self, data, indicators) -> dict:
        """
        Evaluate market data and return signal
        
        Returns:
            dict: Signal information or None
        """
        pass
    
    def calculate_confidence(self, signal_strength: float) -> float:
        """Calculate confidence percentage (0-100)"""
        return min(100.0, max(0.0, signal_strength * 100))
    
    def create_signal(self, symbol: str, action: str, confidence: float, 
                     reason: str) -> dict:
        """Create standardized signal dictionary"""
        return {
            "timestamp": datetime.now().isoformat(),
            "symbol": symbol,
            "strategy": self.name,
            "action": action,
            "confidence": confidence,
            "reason": reason,
            "risk_level": self.assess_risk(confidence)
        }
    
    def assess_risk(self, confidence: float) -> str:
        """Assess risk based on confidence"""
        if confidence >= 80:
            return "LOW"
        elif confidence >= 60:
            return "MEDIUM"
        else:
            return "HIGH"