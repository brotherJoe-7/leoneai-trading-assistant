from sqlalchemy.orm import Session
from typing import List, Optional
from app.schemas import portfolio as portfolio_schema
from app.schemas.trade import TradeCreate
from app.models.portfolio import Portfolio, Position, Trade
from datetime import datetime
import uuid


class PortfolioCRUD:
    """CRUD operations for Portfolio"""

    def get_by_user_id(self, db: Session, user_id: int) -> Optional[Portfolio]:
        return db.query(Portfolio).filter(Portfolio.user_id == user_id).first()

    def create(self, db: Session, user_id: int) -> Portfolio:
        db_portfolio = Portfolio(
            user_id=user_id,
            cash_balance=100000.0,
            cash_balance_leone=2200000000.0,
            total_value=100000.0,
            total_value_leone=2200000000.0,
        )
        db.add(db_portfolio)
        db.commit()
        db.refresh(db_portfolio)
        return db_portfolio

    def update_balance(
        self, db: Session, portfolio_id: int, cash_balance: float
    ) -> Portfolio:
        portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
        if portfolio:
            portfolio.cash_balance = cash_balance
            portfolio.cash_balance_leone = cash_balance * 22000  # USD to SLL conversion
            db.commit()
            db.refresh(portfolio)
        return portfolio

    def update_mobile_money(
        self, db: Session, portfolio_id: int, provider: str, amount: float
    ) -> Portfolio:
        portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
        if portfolio:
            if provider == "ORANGE_MONEY":
                portfolio.orange_money_balance += amount
            elif provider == "AFRICELL_MONEY":
                portfolio.africell_money_balance += amount
            db.commit()
            db.refresh(portfolio)
        return portfolio


class PositionCRUD:
    """CRUD operations for Position"""

    def get_by_portfolio(self, db: Session, portfolio_id: int) -> List[Position]:
        return (
            db.query(Position)
            .filter(
                Position.portfolio_id == portfolio_id,
                Position.is_active == True,
            )
            .all()
        )

    def get_by_symbol(
        self, db: Session, portfolio_id: int, symbol: str
    ) -> Optional[Position]:
        return (
            db.query(Position)
            .filter(
                Position.portfolio_id == portfolio_id,
                Position.symbol == symbol,
                Position.is_active == True,
            )
            .first()
        )

    def create(
        self,
        db: Session,
        portfolio_id: int,
        symbol: str,
        quantity: float,
        avg_price: float,
    ) -> Position:
        db_position = Position(
            portfolio_id=portfolio_id,
            symbol=symbol,
            quantity=quantity,
            avg_price=avg_price,
            current_price=avg_price,
            current_value=quantity * avg_price,
        )
        db.add(db_position)
        db.commit()
        db.refresh(db_position)
        return db_position

    def update(
        self,
        db: Session,
        position_id: int,
        quantity: float = None,
        current_price: float = None,
    ) -> Position:
        position = db.query(Position).filter(Position.id == position_id).first()
        if position:
            if quantity is not None:
                position.quantity = quantity
            if current_price is not None:
                position.current_price = current_price
            position.current_value = position.quantity * position.current_price
            position.pnl = position.current_value - (
                position.quantity * position.avg_price
            )
            position.pnl_percent = (
                (position.pnl / (position.quantity * position.avg_price)) * 100
                if position.avg_price
                else 0
            )
            db.commit()
            db.refresh(position)
        return position

    def delete(self, db: Session, position_id: int) -> bool:
        position = db.query(Position).filter(Position.id == position_id).first()
        if position:
            position.is_active = False
            db.commit()
            return True
        return False


class TradeCRUD:
    """CRUD operations for Trade"""

    def get_by_portfolio(
        self, db: Session, portfolio_id: int, limit: int = 100
    ) -> List[Trade]:
        return (
            db.query(Trade)
            .filter(Trade.portfolio_id == portfolio_id)
            .order_by(Trade.created_at.desc())
            .limit(limit)
            .all()
        )

    def get_by_user(self, db: Session, user_id: int, limit: int = 100) -> List[Trade]:
        return (
            db.query(Trade)
            .filter(Trade.user_id == user_id)
            .order_by(Trade.created_at.desc())
            .limit(limit)
            .all()
        )

    def create(
        self,
        db: Session,
        portfolio_id: int,
        user_id: int,
        trade_data: TradeCreate,
        price: float,
    ) -> Trade:
        total_cost = trade_data.quantity * price
        order_id = f"ORD-{uuid.uuid4().hex[:12].upper()}"

        db_trade = Trade(
            portfolio_id=portfolio_id,
            user_id=user_id,
            symbol=trade_data.symbol,
            action=trade_data.action,
            quantity=trade_data.quantity,
            price=price,
            total_cost=total_cost,
            order_type=trade_data.order_type,
            order_id=order_id,
            status="PENDING",
            payment_method=getattr(trade_data, "payment_method", "CASH"),
        )
        db.add(db_trade)
        db.commit()
        db.refresh(db_trade)
        return db_trade

    def execute_trade(self, db: Session, trade_id: int) -> Trade:
        trade = db.query(Trade).filter(Trade.id == trade_id).first()
        if trade:
            trade.status = "EXECUTED"
            trade.executed_at = datetime.utcnow()
            db.commit()
            db.refresh(trade)
        return trade

    def cancel_trade(self, db: Session, trade_id: int) -> Trade:
        trade = db.query(Trade).filter(Trade.id == trade_id).first()
        if trade:
            trade.status = "CANCELLED"
            db.commit()
            db.refresh(trade)
        return trade


# Create instances
portfolio_crud = PortfolioCRUD()
position_crud = PositionCRUD()
trade_crud = TradeCRUD()
