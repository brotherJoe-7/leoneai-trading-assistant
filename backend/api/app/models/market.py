from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class PriceData(BaseModel):
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: int

class MarketQuote(BaseModel):
    symbol: str
    price: float
    change: float
    change_percent: float
    volume: int
    timestamp: datetime

class MarketHistoryRequest(BaseModel):
    symbol: str
    interval: str = "1d"
    period: str = "1mo"

class MarketHistoryResponse(BaseModel):
    symbol: str
    interval: str
    period: str
    data: List[PriceData]

class LeoneConversion(BaseModel):
    usd_amount: float
    leone_amount: float
    exchange_rate: float = 22000
    timestamp: datetime