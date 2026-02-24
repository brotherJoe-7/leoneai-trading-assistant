from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.models.user import User
from app.models.portfolio import Trade, Portfolio
from app.schemas.admin import SystemStats, AdminDashboardData, AdminTradeMonitor


class CRUDAdmin:
    def get_system_stats(self, db: Session) -> SystemStats:
        total_users = db.query(User).count()

        # Active users (mock logic for now, using login timestamp if available or just created_at)
        one_day_ago = datetime.utcnow() - timedelta(days=1)
        active_users = db.query(User).filter(User.is_active == True).count()

        # Trades in last 24h
        trades_24h = db.query(Trade).filter(Trade.created_at >= one_day_ago).count()

        # Volume in last 24h
        volume_24h = (
            db.query(func.sum(Trade.total_cost))
            .filter(Trade.created_at >= one_day_ago)
            .scalar()
            or 0.0
        )

        return SystemStats(
            total_users=total_users,
            active_users_24h=active_users,  # using active count as proxy
            total_trades_24h=trades_24h,
            total_volume_24h=volume_24h,
        )

    def get_dashboard_data(self, db: Session) -> AdminDashboardData:
        stats = self.get_system_stats(db)

        recent_users = db.query(User).order_by(User.id.desc()).limit(5).all()

        recent_trades_db = (
            db.query(Trade).order_by(Trade.created_at.desc()).limit(10).all()
        )
        recent_trades = []
        for trade in recent_trades_db:
            # Need to join with User to get email, tricky without explicit relationship in model or query
            # Assuming relationship exists or fetching manually
            portfolio = (
                db.query(Portfolio).filter(Portfolio.id == trade.portfolio_id).first()
            )
            user = (
                db.query(User).filter(User.id == portfolio.user_id).first()
                if portfolio
                else None
            )

            recent_trades.append(
                AdminTradeMonitor(
                    trade_id=trade.id,
                    user_email=user.email if user else "Unknown",
                    symbol=trade.symbol,
                    action=trade.action,
                    amount=trade.total_cost,
                    status=trade.status,
                    timestamp=trade.created_at,
                )
            )

        return AdminDashboardData(
            stats=stats, recent_users=recent_users, recent_trades=recent_trades
        )


admin = CRUDAdmin()
