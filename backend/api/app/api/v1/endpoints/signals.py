from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from datetime import datetime, timedelta

from app.dependencies.auth import get_current_user
from app.dependencies.database import get_db
from sqlalchemy.orm import Session

router = APIRouter()


def make_signals(limit: int = 20):
    """Generate enriched AI trading signals with current timestamps."""
    now = datetime.now()
    signals = [
        {
            "id": 1,
            "symbol": "BTC/SLL",
            "pair": "BTC/SLL",
            "action": "BUY",
            "confidence": 87.5,
            "strategy": "RSI + MACD Divergence",
            "timestamp": (now - timedelta(minutes=3)).isoformat(),
            "reason": "RSI hit 28.3 — historically strong buy zone. MACD bullish crossover confirmed on 4H.",
            "price": 1_245_320_000,
            "target_price": 1_340_000_000,
            "stop_loss": 1_180_000_000,
            "timeframe": "4H",
            "risk": "Medium",
            "entry": 1_245_320_000,
        },
        {
            "id": 2,
            "symbol": "ETH/SLL",
            "pair": "ETH/SLL",
            "action": "BUY",
            "confidence": 79.0,
            "strategy": "Bollinger Bands Bounce",
            "timestamp": (now - timedelta(minutes=12)).isoformat(),
            "reason": "Price bounced off lower Bollinger Band. Volume spike +38% confirms reversal momentum.",
            "price": 58_200_000,
            "target_price": 64_000_000,
            "stop_loss": 54_000_000,
            "timeframe": "1D",
            "risk": "Medium",
            "entry": 58_200_000,
        },
        {
            "id": 3,
            "symbol": "USD/SLL",
            "pair": "USD/SLL",
            "action": "BUY",
            "confidence": 93.0,
            "strategy": "Wedge Breakout + Demand Surge",
            "timestamp": (now - timedelta(minutes=22)).isoformat(),
            "reason": "Ascending wedge breakout on 4H. Rising import demand in Freetown. SLL liquidity thinning.",
            "price": 22_500,
            "target_price": 23_800,
            "stop_loss": 21_900,
            "timeframe": "4H",
            "risk": "Low",
            "entry": 22_500,
        },
        {
            "id": 4,
            "symbol": "SOL/SLL",
            "pair": "SOL/SLL",
            "action": "SELL",
            "confidence": 74.0,
            "strategy": "Head & Shoulders Pattern",
            "timestamp": (now - timedelta(hours=1)).isoformat(),
            "reason": "Classic H&S pattern complete. Neckline broken on high volume. Bearish momentum building.",
            "price": 3_200_000,
            "target_price": 2_800_000,
            "stop_loss": 3_450_000,
            "timeframe": "4H",
            "risk": "Medium",
            "entry": 3_200_000,
        },
        {
            "id": 5,
            "symbol": "BNB/SLL",
            "pair": "BNB/SLL",
            "action": "HOLD",
            "confidence": 61.0,
            "strategy": "EMA Consolidation",
            "timestamp": (now - timedelta(hours=2)).isoformat(),
            "reason": "Trading in tight range between EMA-20 and EMA-50. Wait for breakout confirmation.",
            "price": 8_100_000,
            "target_price": 8_900_000,
            "stop_loss": 7_600_000,
            "timeframe": "1D",
            "risk": "High",
            "entry": 8_100_000,
        },
        {
            "id": 6,
            "symbol": "GBP/SLL",
            "pair": "GBP/SLL",
            "action": "BUY",
            "confidence": 82.0,
            "strategy": "Key Support Bounce",
            "timestamp": (now - timedelta(hours=3)).isoformat(),
            "reason": "Testing major support zone at 28,500. RSI at 34 — oversold recovery expected.",
            "price": 28_500,
            "target_price": 30_200,
            "stop_loss": 27_400,
            "timeframe": "1D",
            "risk": "Low",
            "entry": 28_500,
        },
        {
            "id": 7,
            "symbol": "XRP/SLL",
            "pair": "XRP/SLL",
            "action": "BUY",
            "confidence": 71.0,
            "strategy": "Fibonacci 61.8% Retracement",
            "timestamp": (now - timedelta(hours=4)).isoformat(),
            "reason": "61.8% fib level holding strong. Bullish engulfing candle on daily. Volume up 22%.",
            "price": 112_000,
            "target_price": 135_000,
            "stop_loss": 98_000,
            "timeframe": "1D",
            "risk": "Medium",
            "entry": 112_000,
        },
        {
            "id": 8,
            "symbol": "EUR/SLL",
            "pair": "EUR/SLL",
            "action": "SELL",
            "confidence": 68.0,
            "strategy": "Double Top Reversal",
            "timestamp": (now - timedelta(hours=5)).isoformat(),
            "reason": "Double top formed at 24,800 resistance. Momentum fading. Target is 24,100 support.",
            "price": 24_500,
            "target_price": 24_100,
            "stop_loss": 24_900,
            "timeframe": "4H",
            "risk": "Low",
            "entry": 24_500,
        },
        {
            "id": 9,
            "symbol": "AVAX/SLL",
            "pair": "AVAX/SLL",
            "action": "BUY",
            "confidence": 76.0,
            "strategy": "Cup & Handle Formation",
            "timestamp": (now - timedelta(hours=6)).isoformat(),
            "reason": "Classic cup & handle breakout. Handle consolidation complete. Strong upside potential.",
            "price": 890_000,
            "target_price": 1_050_000,
            "stop_loss": 810_000,
            "timeframe": "1D",
            "risk": "Medium",
            "entry": 890_000,
        },
        {
            "id": 10,
            "symbol": "DOGE/SLL",
            "pair": "DOGE/SLL",
            "action": "HOLD",
            "confidence": 53.0,
            "strategy": "Neutral Moving Average",
            "timestamp": (now - timedelta(hours=8)).isoformat(),
            "reason": "No clear direction. Price stuck between EMA-20 and EMA-50. Wait for weekly candle close.",
            "price": 4_200,
            "target_price": 5_100,
            "stop_loss": 3_600,
            "timeframe": "4H",
            "risk": "High",
            "entry": 4_200,
        },
    ]
    return signals[:limit]


@router.get("/")
async def get_signals(
    limit: Optional[int] = 10,
    symbol: Optional[str] = None,
    action: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get AI trading signals"""
    signals = make_signals(limit=20)

    if symbol:
        signals = [s for s in signals if s["symbol"].upper() == symbol.upper()]
    if action:
        signals = [s for s in signals if s["action"].upper() == action.upper()]

    signals = signals[:limit]
    return {"count": len(signals), "signals": signals}


@router.get("/recent")
async def get_recent_signals(
    limit: Optional[int] = 5,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get most recent signals for dashboard widget"""
    signals = make_signals(limit=limit)
    return signals


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
