from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.user import UserResponse


class SystemStats(BaseModel):
    total_users: int
    active_users_24h: int
    total_trades_24h: int
    total_volume_24h: float
    system_health: str = "Healthy"


class AdminUserUpdate(BaseModel):
    is_active: Optional[bool] = None
    is_superuser: Optional[bool] = None
    risk_tolerance: Optional[str] = None


class AdminTradeMonitor(BaseModel):
    trade_id: int
    user_email: str
    symbol: str
    action: str
    amount: float
    status: str
    timestamp: datetime


class AdminDashboardData(BaseModel):
    stats: SystemStats
    recent_users: List[UserResponse]
    recent_trades: List[AdminTradeMonitor]
