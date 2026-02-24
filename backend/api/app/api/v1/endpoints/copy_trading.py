from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel
import random

from app.api.deps import get_current_active_user
from app.models.user import User

router = APIRouter()


# Schemas
class Trader(BaseModel):
    id: int
    name: str
    win_rate: float
    pnl_percent: float
    followers: int
    risk_score: int
    avatar: str


class CopyTradeRequest(BaseModel):
    trader_id: int
    amount: float
    stop_loss: float


# Mock Data
MOCK_TRADERS = [
    {
        "id": 1,
        "name": "CryptoKing",
        "win_rate": 78.5,
        "pnl_percent": 342.1,
        "followers": 1250,
        "risk_score": 7,
        "avatar": "👑",
    },
    {
        "id": 2,
        "name": "SafeHands",
        "win_rate": 92.0,
        "pnl_percent": 156.4,
        "followers": 3400,
        "risk_score": 3,
        "avatar": "🛡️",
    },
    {
        "id": 3,
        "name": "AlphaSeeker",
        "win_rate": 65.2,
        "pnl_percent": 560.8,
        "followers": 890,
        "risk_score": 9,
        "avatar": "🚀",
    },
    {
        "id": 4,
        "name": "LeoneWhale",
        "win_rate": 81.3,
        "pnl_percent": 210.5,
        "followers": 5600,
        "risk_score": 5,
        "avatar": "🐋",
    },
]


@router.get("/traders", response_model=List[Trader])
async def get_top_traders(current_user: User = Depends(get_current_active_user)):
    """Get list of top traders to copy"""
    return MOCK_TRADERS


@router.post("/follow")
async def follow_trader(
    request: CopyTradeRequest, current_user: User = Depends(get_current_active_user)
):
    """Start copying a trader"""
    trader = next((t for t in MOCK_TRADERS if t["id"] == request.trader_id), None)
    if not trader:
        raise HTTPException(status_code=404, detail="Trader not found")

    return {
        "status": "success",
        "message": f"Now copying {trader['name']}",
        "copy_settings": {"amount": request.amount, "stop_loss": request.stop_loss},
    }
