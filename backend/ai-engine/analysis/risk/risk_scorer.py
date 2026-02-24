import numpy as np

class RiskScorer:
    """Calculate risk scores for trades"""
    
    @staticmethod
    def calculate_position_risk(confidence: float, volatility: float, 
                               portfolio_percentage: float) -> float:
        """Calculate position risk score (0-100)"""
        # Base risk from confidence (inverse relationship)
        confidence_risk = (100 - confidence) / 100
        
        # Volatility risk (normalized 0-1)
        vol_risk = min(volatility * 10, 1)  # Assuming volatility is decimal
        
        # Position size risk
        size_risk = min(portfolio_percentage / 10, 1)  # 10% max position
        
        # Weighted average
        total_risk = (confidence_risk * 0.4 + vol_risk * 0.3 + size_risk * 0.3) * 100
        
        return min(total_risk, 100)
    
    @staticmethod
    def assess_risk_level(risk_score: float) -> str:
        """Convert risk score to risk level"""
        if risk_score < 30:
            return "LOW"
        elif risk_score < 60:
            return "MEDIUM"
        else:
            return "HIGH"
    
    @staticmethod
    def calculate_portfolio_var(returns: np.ndarray, confidence_level: float = 0.95) -> float:
        """Calculate Value at Risk (VaR)"""
        if len(returns) == 0:
            return 0
        
        sorted_returns = np.sort(returns)
        index = int((1 - confidence_level) * len(sorted_returns))
        return abs(sorted_returns[index]) if index < len(sorted_returns) else 0