from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.models.signal import Signal
from app.schemas.signal import SignalCreate, SignalFilter
from .base import CRUDBase


class CRUDSignal(CRUDBase[Signal, SignalCreate, SignalCreate]):
    def get_by_symbol(
        self, db: Session, *, symbol: str, skip: int = 0, limit: int = 100
    ) -> List[Signal]:
        return (
            db.query(Signal)
            .filter(Signal.symbol == symbol)
            .order_by(Signal.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_active_signals(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Signal]:
        return (
            db.query(Signal)
            .filter(Signal.is_active == True)
            .order_by(Signal.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def filter_signals(
        self, db: Session, *, filter: SignalFilter, skip: int = 0, limit: int = 100
    ) -> List[Signal]:
        query = db.query(Signal)

        if filter.symbol:
            query = query.filter(Signal.symbol == filter.symbol)

        if filter.action:
            query = query.filter(Signal.action == filter.action)

        if filter.min_confidence:
            query = query.filter(Signal.confidence >= filter.min_confidence)

        if filter.max_confidence:
            query = query.filter(Signal.confidence <= filter.max_confidence)

        if filter.start_date:
            query = query.filter(Signal.created_at >= filter.start_date)

        if filter.end_date:
            query = query.filter(Signal.created_at <= filter.end_date)

        return query.order_by(Signal.created_at.desc()).offset(skip).limit(limit).all()

    def deactivate_old_signals(self, db: Session, *, days: int = 1) -> int:
        """Deactivate signals older than specified days"""
        cutoff_date = datetime.now() - datetime.timedelta(days=days)

        result = (
            db.query(Signal)
            .filter(Signal.created_at < cutoff_date, Signal.is_active == True)
            .update({"is_active": False})
        )
        db.commit()
        return result


signal = CRUDSignal(Signal)
