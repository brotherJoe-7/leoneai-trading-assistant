from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from app.services.pro_market_service import pro_market_service
from app.api.deps import get_current_active_user
from app.models.user import User

router = APIRouter()


# Schemas
class OrderBookResponse(BaseModel):
    lastUpdateId: int
    bids: List[List[float]]
    asks: List[List[float]]


class TradeResponse(BaseModel):
    id: int
    price: float
    qty: float
    quoteQty: float
    time: int
    isBuyerMaker: bool
    isBestMatch: bool


class OrderCreate(BaseModel):
    symbol: str
    side: str
    type: str
    quantity: float
    price: Optional[float] = None
    stopPrice: Optional[float] = None


# Endpoints


@router.get("/depth", response_model=OrderBookResponse)
async def get_order_book(
    symbol: str = "BTC/USD",
    limit: int = 10,
    current_user: User = Depends(get_current_active_user),
):
    """Get market depth (Order Book)"""
    return pro_market_service.get_order_book(symbol, limit)


@router.get("/trades", response_model=List[TradeResponse])
async def get_recent_trades(
    symbol: str = "BTC/USD",
    limit: int = 20,
    current_user: User = Depends(get_current_active_user),
):
    """Get recent trades"""
    return pro_market_service.get_recent_trades(symbol, limit)


@router.get("/ticker/24hr")
async def get_ticker_24hr(
    symbol: str = "BTC/USD", current_user: User = Depends(get_current_active_user)
):
    """Get 24hr ticker price change statistics"""
    return pro_market_service.get_ticker_24h(symbol)


@router.post("/order")
async def place_order(
    order: OrderCreate, current_user: User = Depends(get_current_active_user)
):
    """Place a new order (Simulated)"""
    return pro_market_service.place_order(order.dict())
