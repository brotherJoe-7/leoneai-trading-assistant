from fastapi import APIRouter, Depends
from typing import List
import yfinance as yf
from datetime import datetime, timedelta

from app.dependencies.auth import get_current_user

router = APIRouter()

@router.get("/prices/{symbol}")
async def get_price(symbol: str, current_user: dict = Depends(get_current_user)):
    """Get current price for a symbol"""
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period="1d", interval="1m")
        
        if hist.empty:
            return {"error": f"No data for symbol {symbol}"}
        
        latest = hist.iloc[-1]
        
        return {
            "symbol": symbol,
            "price": float(latest["Close"]),
            "timestamp": datetime.now().isoformat(),
            "change": float(latest["Close"] - hist.iloc[-2]["Close"]) if len(hist) > 1 else 0,
            "change_percent": float(((latest["Close"] - hist.iloc[-2]["Close"]) / hist.iloc[-2]["Close"] * 100)) if len(hist) > 1 else 0
        }
    except Exception as e:
        return {"error": str(e)}

@router.get("/history/{symbol}")
async def get_history(symbol: str, interval: str = "1d", period: str = "1mo", 
                     current_user: dict = Depends(get_current_user)):
    """Get historical price data"""
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval)
        
        if hist.empty:
            return {"error": f"No historical data for {symbol}"}
        
        # Convert to list of dicts
        data = []
        for index, row in hist.iterrows():
            data.append({
                "timestamp": index.isoformat(),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": int(row["Volume"])
            })
        
        return {
            "symbol": symbol,
            "interval": interval,
            "period": period,
            "data": data
        }
    except Exception as e:
        return {"error": str(e)}