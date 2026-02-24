import yfinance as yf
import pandas as pd
from .base_collector import BaseCollector

class StockCollector(BaseCollector):
    """Collect stock market data"""
    
    def __init__(self):
        self.symbols = ["AAPL", "GOOGL", "TSLA", "MSFT"]
    
    def collect(self) -> pd.DataFrame:
        """Collect stock data"""
        data_frames = []
        
        for symbol in self.symbols:
            try:
                ticker = yf.Ticker(symbol)
                hist = ticker.history(period="1d", interval="5m")
                hist["symbol"] = symbol
                data_frames.append(hist)
            except Exception as e:
                print(f"Error collecting {symbol}: {e}")
        
        return pd.concat(data_frames) if data_frames else pd.DataFrame()
    
    def validate_data(self, data: pd.DataFrame) -> bool:
        return not data.empty and "Close" in data.columns