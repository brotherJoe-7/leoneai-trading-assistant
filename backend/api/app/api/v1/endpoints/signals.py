from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime, timedelta

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

# Mock signals for development
MOCK_SIGNALS = [
    {
        "id": 1,
        "symbol": "BTC-USD",
        "action": "BUY",
        "confidence": 85.5,
        "strategy": "RSI Strategy",
        "timestamp": (datetime.now() - timedelta(minutes=5)).isoformat(),
        "reason": "RSI oversold at 28.5",
        "price": 45000.50,
        "target_price": 48000.00,
        "stop_loss": 42000.00
    },
    {
        "id": 2,
        "symbol": "ETH-USD",
        "action": "HOLD",
        "confidence": 65.0,
        "strategy": "MACD Strategy",
        "timestamp": (datetime.now() - timedelta(minutes=15)).isoformat(),
        "reason": "MACD neutral, waiting for confirmation",
        "price": 3200.75,
        "target_price": 3400.00,
        "stop_loss": 3000.00
    }
]

@router.get("/")
async def get_signals(
    limit: Optional[int] = 10,
    symbol: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get recent trading signals"""
    filtered_signals = MOCK_SIGNALS
    
    if symbol:
        filtered_signals = [s for s in filtered_signals if s["symbol"] == symbol]
    
    # Apply limit
    filtered_signals = filtered_signals[:limit]
    
    return {
        "count": len(filtered_signals),
        "signals": filtered_signals
    }

@router.get("/{signal_id}")
async def get_signal(signal_id: int, current_user: dict = Depends(get_current_user)):
    """Get a specific signal by ID"""
    for signal in MOCK_SIGNALS:
        if signal["id"] == signal_id:
            return signal
    
    raise HTTPException(status_code=404, detail="Signal not found")

@router.post("/webhook")
async def webhook_signal(signal_data: dict, current_user: dict = Depends(get_current_user)):
    """Webhook endpoint for AI engine to send signals"""
    # TODO: Implement webhook processing
    return {
        "status": "received",
        "signal_id": 999,
        "message": "Signal received and queued for processing"
    }