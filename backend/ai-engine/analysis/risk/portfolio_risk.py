import numpy as np
import pandas as pd

class PortfolioRiskAnalyzer:
    """Analyze portfolio-level risk"""
    
    def __init__(self):
        self.positions = {}
    
    def add_position(self, symbol: str, weight: float, returns: np.ndarray):
        """Add a position to portfolio"""
        self.positions[symbol] = {
            "weight": weight,
            "returns": returns
        }
    
    def calculate_portfolio_risk(self):
        """Calculate portfolio risk metrics"""
        if not self.positions:
            return {}
        
        symbols = list(self.positions.keys())
        weights = np.array([self.positions[s]["weight"] for s in symbols])
        
        # Calculate correlation matrix (simplified)
        returns_matrix = np.column_stack([self.positions[s]["returns"] for s in symbols])
        corr_matrix = np.corrcoef(returns_matrix.T)
        
        # Calculate portfolio variance
        cov_matrix = np.cov(returns_matrix.T)
        portfolio_variance = np.dot(weights.T, np.dot(cov_matrix, weights))
        portfolio_std = np.sqrt(portfolio_variance)
        
        return {
            "portfolio_std": portfolio_std,
            "portfolio_variance": portfolio_variance,
            "correlation_matrix": corr_matrix.tolist(),
            "sharpe_ratio": self.calculate_sharpe_ratio(returns_matrix.mean(axis=0), portfolio_std)
        }
    
    def calculate_sharpe_ratio(self, returns: np.ndarray, std_dev: float, 
                              risk_free_rate: float = 0.02) -> float:
        """Calculate Sharpe ratio"""
        if std_dev == 0:
            return 0
        excess_returns = returns.mean() - risk_free_rate
        return excess_returns / std_dev