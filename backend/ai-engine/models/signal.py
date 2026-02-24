from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.sql import func
from models.base import Base


class Signal(Base):
    __tablename__ = "signals"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String(20), nullable=False, index=True)
    action = Column(String(10), nullable=False)  # BUY, SELL, HOLD
    confidence = Column(Float, nullable=False)
    strategy = Column(String(50), nullable=False)
    reason = Column(Text)

    # Price information
    price = Column(Float)
    target_price = Column(Float)
    stop_loss = Column(Float)

    # Status
    is_active = Column(Boolean, default=True)
    executed = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to user who received the signal
    user_id = Column(Integer, index=True)
