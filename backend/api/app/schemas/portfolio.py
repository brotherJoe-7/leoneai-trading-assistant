from pydantic import BaseModel, Field
from typing import List, Optional


# Supported payment methods
PAYMENT_METHODS = [
    "Orange Money",
    "Afrimoney",
    "Bank Transfer",
    "PayPal",
    "Stripe",
    "Visa/Mastercard",
]


class DepositRequest(BaseModel):
    amount_sll: float = Field(
        ..., gt=0, description="Amount to deposit in SLL (Sierra Leone Leone)"
    )
    payment_method: str = Field(
        ..., description="Payment method: Orange Money, Afrimoney, PayPal, etc."
    )
    phone_number: Optional[str] = Field(
        None, description="Phone number for mobile money payments"
    )
    email: Optional[str] = Field(None, description="Email for PayPal payments")
    card_last4: Optional[str] = Field(
        None, description="Last 4 digits for card payments (display only)"
    )


class WithdrawRequest(BaseModel):
    amount_sll: float = Field(..., gt=0, description="Amount to withdraw in SLL")
    payment_method: str = Field(
        ...,
        description="Payment method: Orange Money, Afrimoney, Bank Transfer, PayPal, etc.",
    )
    account_details: str = Field(
        ...,
        description="Phone number, email, or account number for the withdrawal destination",
    )


class HoldingResponse(BaseModel):
    symbol: str
    name: str
    quantity: float
    avg_price_usd: float
    current_price_usd: float
    current_value_usd: float
    current_value_sll: float
    pnl_percent: float
    pnl_usd: float
    pnl_sll: float


class PortfolioResponse(BaseModel):
    user_id: int
    total_value_usd: float
    total_value_sll: float
    daily_change_percent: float
    total_profit_usd: float
    total_profit_sll: float
    cash_balance_usd: float
    cash_balance_sll: float
    holdings: List[HoldingResponse]


class PortfolioStats(BaseModel):
    total_value: float
    daily_change: float
    total_profit: float
    profit_percent: float


class PortfolioSummary(BaseModel):
    total_value: float
    total_value_leone: float
    cash_balance: float
    cash_balance_leone: float
    invested_amount: float
    total_pnl: float
    daily_pnl: float
    position_count: int
