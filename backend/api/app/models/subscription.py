from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
    Boolean,
    Enum,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum


class PlanType(str, enum.Enum):
    FREE = "FREE"
    PREMIUM = "PREMIUM"
    ENTERPRISE = "ENTERPRISE"


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer, ForeignKey("users.id"), unique=False, nullable=False, index=True
    )

    plan_type = Column(String(20), default=PlanType.FREE, nullable=False)
    is_active = Column(Boolean, default=True)

    start_date = Column(DateTime, server_default=func.now())
    end_date = Column(DateTime, nullable=True)

    auto_renew = Column(Boolean, default=False)
    payment_method = Column(String(50), nullable=True)
    payment_reference = Column(String(100), nullable=True)  # Transaction ID

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="subscription")
