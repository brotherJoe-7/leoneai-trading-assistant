import pandas as pd
import requests
from .base_collector import BaseCollector

class ForexCollector(BaseCollector):
    """Collect forex market data"""
    
    def __init__(self):
        self.pairs = ["USDSLL", "EURUSD", "GBPUSD"]
    
    def collect(self) -> pd.DataFrame:
        """Collect forex data from free API"""
        data = []
        
        for pair in self.pairs:
            try:
                # Using free forex API (example)
                url = f"https://api.exchangerate-api.com/v4/latest/{pair[:3]}"
                response = requests.get(url)
                if response.status_code == 200:
                    rates = response.json()["rates"]
                    if pair[3:] in rates:
                        rate = rates[pair[3:]]
                        data.append({
                            "pair": pair,
                            "rate": rate,
                            "timestamp": pd.Timestamp.now()
                        })
            except Exception as e:
                print(f"Error collecting {pair}: {e}")
        
        return pd.DataFrame(data)
    
    def validate_data(self, data: pd.DataFrame) -> bool:
        return not data.empty and "rate" in data.columns