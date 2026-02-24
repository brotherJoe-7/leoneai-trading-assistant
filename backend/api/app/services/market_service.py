import yfinance as yf
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import requests

class MarketService:
    """Service for market data operations"""
    
    @staticmethod
    def get_latest_price(symbol: str) -> Optional[Dict[str, Any]]:
        """Get latest price for a symbol"""
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="1d", interval="1m")
            
            if hist.empty:
                return None
            
            latest = hist.iloc[-1]
            previous = hist.iloc[-2] if len(hist) > 1 else latest
            
            return {
                "symbol": symbol,
                "price": float(latest["Close"]),
                "open": float(latest["Open"]),
                "high": float(latest["High"]),
                "low": float(latest["Low"]),
                "volume": int(latest["Volume"]),
                "change": float(latest["Close"] - previous["Close"]),
                "change_percent": float(((latest["Close"] - previous["Close"]) / previous["Close"]) * 100) if previous["Close"] != 0 else 0,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            print(f"Error getting price for {symbol}: {e}")
            return None
    
    @staticmethod
    def convert_to_leone(usd_amount: float, exchange_rate: float = 22000) -> Dict[str, Any]:
        """Convert USD to Sierra Leone Leone"""
        leone_amount = usd_amount * exchange_rate
        
        return {
            "usd_amount": usd_amount,
            "leone_amount": leone_amount,
            "exchange_rate": exchange_rate,
            "timestamp": datetime.now().isoformat()
        }
    
    @staticmethod
    def get_exchange_rate(from_currency: str = "USD", to_currency: str = "SLL") -> Optional[float]:
        """Get exchange rate between currencies"""
        # TODO: Implement actual exchange rate API
        # For now, return fixed rate for USD to SLL
        if from_currency == "USD" and to_currency == "SLL":
            return 22000  # Example rate
        
        # Try free API
        try:
            response = requests.get(f"https://api.exchangerate-api.com/v4/latest/{from_currency}")
            if response.status_code == 200:
                rates = response.json().get("rates", {})
                return rates.get(to_currency)
        except:
            pass
        
        return None