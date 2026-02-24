from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100))
    hashed_password = Column(String(255), nullable=False)
    country = Column(String(50), default="Sierra Leone")
    currency_preference = Column(String(3), default="SLL")
    risk_tolerance = Column(String(20), default="MODERATE")

    # Portfolio Balance
    balance_sll = Column(Float, default=0.0)
    balance_usd = Column(Float, default=0.0)

    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Preferences
    notifications_enabled = Column(Boolean, default=True)
    email_alerts = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    dark_mode = Column(Boolean, default=True)
    language = Column(String(10), default="en")

    # Subscription (Convenience field, source of truth is Subscription table)
    plan_type = Column(String(20), default="FREE")

    # Relationships
    subscription = relationship("Subscription", back_populates="user", uselist=False)
