from pydantic import BaseModel, validator, Field
from typing import Optional
from datetime import datetime


class TradeCreate(BaseModel):
    symbol: str = Field(
        ..., min_length=3, max_length=20, description="Trading symbol (e.g., BTC-USD)"
    )
    action: str = Field(..., description="Trade action: BUY or SELL")
    quantity: float = Field(
        ..., gt=0, description="Quantity to trade (must be positive)"
    )
    order_type: str = Field(default="MARKET", description="Order type: MARKET or LIMIT")
    limit_price: Optional[float] = Field(
        None, gt=0, description="Limit price for LIMIT orders"
    )

    @validator("symbol")
    def validate_symbol(cls, v):
        """Validate symbol format"""
        if not v or len(v.strip()) == 0:
            raise ValueError("Symbol cannot be empty")
        # Remove any whitespace and convert to uppercase
        v = v.strip().upper()
        # Basic validation - should contain alphanumeric and possibly dash or slash
        if not all(c.isalnum() or c in ["-", "/", "_"] for c in v):
            raise ValueError("Symbol contains invalid characters")
        return v

    @validator("action")
    def validate_action(cls, v):
        """Validate action is BUY or SELL"""
        v = v.strip().upper()
        if v not in ["BUY", "SELL"]:
            raise ValueError("Action must be BUY or SELL")
        return v

    @validator("quantity")
    def validate_quantity(cls, v):
        """Validate quantity is positive and reasonable"""
        if v <= 0:
            raise ValueError("Quantity must be greater than 0")
        if v > 1000000:  # Prevent unreasonably large trades
            raise ValueError("Quantity exceeds maximum allowed (1,000,000)")
        return v

    @validator("order_type")
    def validate_order_type(cls, v):
        """Validate order type"""
        v = v.strip().upper()
        if v not in ["MARKET", "LIMIT"]:
            raise ValueError("Order type must be MARKET or LIMIT")
        return v

    @validator("limit_price")
    def validate_limit_price(cls, v, values):
        """Validate limit price is provided for LIMIT orders"""
        if values.get("order_type") == "LIMIT" and v is None:
            raise ValueError("Limit price is required for LIMIT orders")
        if v is not None and v <= 0:
            raise ValueError("Limit price must be greater than 0")
        return v


class TradeResponse(BaseModel):
    id: int
    user_id: int
    symbol: str
    action: str
    quantity: float
    price_usd: float
    price_sll: float
    total_cost_usd: float
    total_cost_sll: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
