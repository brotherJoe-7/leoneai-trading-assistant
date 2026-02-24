import yfinance as yf
import pandas as pd
from .base_collector import BaseCollector

class CryptoCollector(BaseCollector):
    """Collect cryptocurrency market data"""
    
    def __init__(self):
        self.symbols = ["BTC-USD", "ETH-USD", "XRP-USD"]
    
    def collect(self) -> pd.DataFrame:
        """Collect cryptocurrency data"""
        data_frames = []
        
        for symbol in self.symbols:
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="1d", interval="5m")
                hist["symbol"] = symbol
                data_frames.append(hist)
            except Exception as e:
                print(f"Error collecting {symbol}: {e}")
        
        if data_frames:
            return pd.concat(data_frames)
        return pd.DataFrame()
    
    def validate_data(self, data: pd.DataFrame) -> bool:
        """Validate cryptocurrency data"""
        if data.empty:
            return False
        
        required_columns = ["Open", "High", "Low", "Close", "Volume"]
        return all(col in data.columns for col in required_columns)