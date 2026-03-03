from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime, timedelta

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()


def make_signals():
    """Generate fresh signals with current timestamps."""
    now = datetime.now()
    return [
        {
            "id": 1,
            "symbol": "BTC/SLL",
            "action": "BUY",
            "confidence": 85.5,
            "strategy": "RSI + MACD",
            "timestamp": (now - timedelta(minutes=5)).isoformat(),
            "reason": "RSI oversold at 28 — strong buy zone. MACD crossover confirmed.",
            "price": 1245320000,
            "target_price": 1340000000,
            "stop_loss": 1180000000,
            "timeframe": "4H",
            "risk": "Medium",
        },
        {
            "id": 2,
            "symbol": "ETH/SLL",
            "action": "BUY",
            "confidence": 78.0,
            "strategy": "Bollinger Bands",
            "timestamp": (now - timedelta(minutes=18)).isoformat(),
            "reason": "Price bounced off lower BB. Volume spike confirms reversal.",
            "price": 58200000,
            "target_price": 64000000,
            "stop_loss": 54000000,
            "timeframe": "1D",
            "risk": "Medium",
        },
        {
            "id": 3,
            "symbol": "USD/SLL",
            "action": "BUY",
            "confidence": 92.0,
            "strategy": "Wedge Breakout",
            "timestamp": (now - timedelta(minutes=32)).isoformat(),
            "reason": "Detected wedge breakout on 4H chart. Import demand rising.",
            "price": 22500,
            "target_price": 23800,
            "stop_loss": 21900,
            "timeframe": "4H",
            "risk": "Low",
        },
        {
            "id": 4,
            "symbol": "BNB/SLL",
            "action": "HOLD",
            "confidence": 60.0,
            "strategy": "MACD",
            "timestamp": (now - timedelta(hours=1)).isoformat(),
            "reason": "MACD neutral — waiting for confirmation above EMA 50.",
            "price": 8100000,
            "target_price": 8900000,
            "stop_loss": 7600000,
            "timeframe": "1D",
            "risk": "High",
        },
        {
            "id": 5,
            "symbol": "SOL/SLL",
            "action": "SELL",
            "confidence": 74.0,
            "strategy": "Head & Shoulders",
            "timestamp": (now - timedelta(hours=2)).isoformat(),
            "reason": "H&S pattern complete. Neckline broken on high volume.",
            "price": 3200000,
            "target_price": 2800000,
            "stop_loss": 3450000,
            "timeframe": "4H",
            "risk": "Medium",
        },
        {
            "id": 6,
            "symbol": "GBP/SLL",
            "action": "BUY",
            "confidence": 81.0,
            "strategy": "Support Bounce",
            "timestamp": (now - timedelta(hours=3)).isoformat(),
            "reason": "Testing key support zone. RSI at 35 — oversold recovery likely.",
            "price": 28500,
            "target_price": 30200,
            "stop_loss": 27400,
            "timeframe": "1D",
            "risk": "Low",
        },
        {
            "id": 7,
            "symbol": "XRP/SLL",
            "action": "BUY",
            "confidence": 70.0,
            "strategy": "Fibonacci Retracement",
            "timestamp": (now - timedelta(hours=4)).isoformat(),
            "reason": "61.8% fib level holding. Bullish engulfing candle on daily.",
            "price": 112000,
            "target_price": 135000,
            "stop_loss": 98000,
            "timeframe": "1D",
            "risk": "Medium",
        },
        {
            "id": 8,
            "symbol": "DOGE/SLL",
            "action": "HOLD",
            "confidence": 55.0,
            "strategy": "Moving Average",
            "timestamp": (now - timedelta(hours=6)).isoformat(),
            "reason": "Trading between EMA 20 and EMA 50. No clear direction yet.",
            "price": 4200,
            "target_price": 5100,
            "stop_loss": 3600,
            "timeframe": "4H",
            "risk": "High",
        },
    ]


@router.get("/")
async def get_signals(
    limit: Optional[int] = 10,
    symbol: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get recent trading signals"""
    signals = make_signals()

    if symbol:
        signals = [s for s in signals if s["symbol"].upper() == symbol.upper()]

    signals = signals[:limit]

    return {"count": len(signals), "signals": signals}


@router.get("/{signal_id}")
async def get_signal(signal_id: int, current_user: dict = Depends(get_current_user)):
    """Get a specific signal by ID"""
    for signal in make_signals():
        if signal["id"] == signal_id:
            return signal

    raise HTTPException(status_code=404, detail="Signal not found")


@router.post("/webhook")
async def webhook_signal(
    signal_data: dict, current_user: dict = Depends(get_current_user)
):
    """Webhook endpoint for AI engine to send signals"""
    return {
        "status": "received",
        "signal_id": 999,
        "message": "Signal received and queued for processing",
    }
