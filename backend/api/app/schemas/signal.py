from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SignalBase(BaseModel):
    symbol: str
    action: str  # BUY, SELL, HOLD
    confidence: float
    strategy: str
    reason: Optional[str] = None

class SignalCreate(SignalBase):
    price: Optional[float] = None
    target_price: Optional[float] = None
    stop_loss: Optional[float] = None

class SignalResponse(SignalBase):
    id: int
    timestamp: datetime
    price: Optional[float]
    target_price: Optional[float]
    stop_loss: Optional[float]
    is_active: bool = True

class SignalFilter(BaseModel):
    symbol: Optional[str] = None
    action: Optional[str] = None
    min_confidence: Optional[float] = None
    max_confidence: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None