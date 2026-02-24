from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Balances
    cash_balance = Column(Float, default=100000.0)  # Starting balance in USD
    cash_balance_leone = Column(Float, default=2200000000.0)  # In SLL
    total_value = Column(Float, default=100000.0)
    total_value_leone = Column(Float, default=2200000000.0)

    # Performance metrics
    total_invested = Column(Float, default=0.0)
    total_pnl = Column(Float, default=0.0)
    total_pnl_percent = Column(Float, default=0.0)
    daily_pnl = Column(Float, default=0.0)

    # Mobile money integration
    orange_money_balance = Column(Float, default=0.0)
    africell_money_balance = Column(Float, default=0.0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    positions = relationship("Position", back_populates="portfolio")
    trades = relationship("Trade", back_populates="portfolio")


class Position(Base):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(
        Integer, ForeignKey("portfolios.id"), nullable=False, index=True
    )

    symbol = Column(String(20), nullable=False, index=True)
    quantity = Column(Float, nullable=False)
    avg_price = Column(Float, nullable=False)
    current_price = Column(Float, default=0.0)

    # Calculated fields
    current_value = Column(Float, default=0.0)
    pnl = Column(Float, default=0.0)
    pnl_percent = Column(Float, default=0.0)

    # Status
    is_active = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    portfolio = relationship("Portfolio", back_populates="positions")


class Trade(Base):
    __tablename__ = "trades"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(
        Integer, ForeignKey("portfolios.id"), nullable=False, index=True
    )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    # Trade details
    symbol = Column(String(20), nullable=False, index=True)
    action = Column(String(10), nullable=False)  # BUY, SELL
    quantity = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    total_cost = Column(Float, nullable=False)

    # Order details
    order_type = Column(String(20), default="MARKET")  # MARKET, LIMIT, STOP
    order_id = Column(String(50), unique=True, index=True)
    status = Column(
        String(20), default="PENDING"
    )  # PENDING, EXECUTED, CANCELLED, FAILED

    # Payment method
    payment_method = Column(
        String(50), default="CASH"
    )  # CASH, ORANGE_MONEY, AFRICELL_MONEY

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    executed_at = Column(DateTime(timezone=True))

    # Relationships
    portfolio = relationship("Portfolio", back_populates="trades")
