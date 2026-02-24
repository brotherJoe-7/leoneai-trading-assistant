from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SubscriptionBase(BaseModel):
    is_active: bool = True
    auto_renew: bool = False
    plan_type: str
    payment_method: Optional[str] = None


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(BaseModel):
    plan_type: str


class SubscriptionResponse(SubscriptionBase):
    id: int
    user_id: int
    start_date: datetime
    end_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
