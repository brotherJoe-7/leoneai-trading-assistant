from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.dependencies.database import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.schemas.trade import TradeCreate, TradeResponse
from app.schemas.portfolio import (
    PortfolioResponse,
    PortfolioStats,
    HoldingResponse,
    DepositRequest,
    WithdrawRequest,
)
from app.core.currency import to_sll, to_usd, EXCHANGE_RATE_USD_SLL
from app.services.pro_market_service import pro_market_service
from app.services.portfolio_service import portfolio_service
from app.crud.portfolio import position_crud, portfolio_crud, trade_crud

router = APIRouter()

# ── Supported payment methods ──────────────────────────────────────────────
MOBILE_METHODS = {"Orange Money", "Afrimoney"}
INTERNATIONAL_METHODS = {"PayPal", "Stripe", "Visa/Mastercard", "Bank Transfer"}


@router.get("/", response_model=PortfolioResponse)
async def get_portfolio(
    current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)
):
    """Get user's complete portfolio"""
    summary = await portfolio_service.get_portfolio_summary(db, current_user.id)

    return {
        "user_id": current_user.id,
        "total_value_usd": summary.total_value,
        "total_value_sll": summary.total_value_leone,
        "daily_change_percent": 0.0,
        "total_profit_usd": summary.total_pnl / 23.7,
        "total_profit_sll": summary.total_pnl,
        "cash_balance_usd": summary.cash_balance,
        "cash_balance_sll": summary.cash_balance_leone,
        "holdings": [],
    }


@router.get("/holdings", response_model=List[HoldingResponse])
async def get_holdings(
    current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)
):
    portfolio = portfolio_service.get_or_create_portfolio(db, current_user.id)
    positions = position_crud.get_by_portfolio(db, portfolio.id)

    return [
        {
            "symbol": p.symbol,
            "quantity": p.quantity,
            "avg_price": p.avg_price,
            "current_price": p.current_price,
            "current_value": p.current_value,
            "pnl": p.pnl,
            "pnl_percent": p.pnl_percent,
        }
        for p in positions
    ]


@router.get("/stats")
async def get_stats(
    current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)
):
    """Get portfolio statistics for dashboard"""
    try:
        summary = await portfolio_service.get_portfolio_summary(db, current_user.id)
        return {
            "total_value": summary.total_value_leone,
            "daily_change": 0.0,
            "total_profit": summary.total_pnl,
            "profit_percent": (summary.total_pnl / max(summary.total_value_leone, 1))
            * 100,
        }
    except Exception:
        return {
            "total_value": current_user.balance_sll or 0,
            "daily_change": 0.0,
            "total_profit": 0.0,
            "profit_percent": 0.0,
        }


@router.post("/trade", response_model=TradeResponse)
async def execute_trade(
    trade: TradeCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Execute a trade (buy/sell)"""
    import logging
    from app.core.logging_config import log_trade_execution, log_security_event

    logger = logging.getLogger(__name__)

    try:
        logger.info(
            f"Trade attempt - User: {current_user.id}, Symbol: {trade.symbol}, Action: {trade.action}"
        )

        executed_trade = await portfolio_service.execute_trade(
            db, current_user.id, trade
        )

        log_trade_execution(
            current_user.id,
            {
                "symbol": trade.symbol,
                "action": trade.action,
                "quantity": trade.quantity,
                "price": executed_trade.price,
                "total_cost": executed_trade.total_cost,
            },
        )

        return {
            "id": executed_trade.id,
            "user_id": current_user.id,
            "symbol": executed_trade.symbol,
            "action": executed_trade.action,
            "quantity": executed_trade.quantity,
            "price_usd": to_usd(executed_trade.price),
            "price_sll": executed_trade.price,
            "total_cost_usd": to_usd(executed_trade.total_cost),
            "total_cost_sll": executed_trade.total_cost,
            "status": "completed",
            "created_at": executed_trade.created_at,
            "message": f"Successfully {executed_trade.action} {executed_trade.quantity} {executed_trade.symbol}",
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(
            f"Trade execution failed - User: {current_user.id}, Error: {str(e)}",
            exc_info=True,
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Trade execution failed. Please try again later.",
        )


@router.post("/deposit")
async def deposit_funds(
    body: DepositRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Deposit funds (SLL) — accepts a JSON body with amount_sll, payment_method, phone_number, etc."""
    amount_sll = body.amount_sll
    payment_method = body.payment_method

    all_methods = MOBILE_METHODS | INTERNATIONAL_METHODS
    if payment_method not in all_methods:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported payment method. Choose from: {', '.join(sorted(all_methods))}",
        )

    try:
        # Re-query user within THIS session to avoid cross-session DetachedInstanceError
        user = db.query(User).filter(User.id == current_user.id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        user.balance_sll = (user.balance_sll or 0) + amount_sll
        db.commit()
        db.refresh(user)

        new_balance = user.balance_sll
        txn_id = f"DEP-{int(datetime.utcnow().timestamp())}"

        if payment_method in MOBILE_METHODS:
            detail_msg = f"via {payment_method}" + (
                f" to {body.phone_number}" if body.phone_number else ""
            )
        elif payment_method == "PayPal":
            detail_msg = f"via PayPal" + (f" ({body.email})" if body.email else "")
        else:
            detail_msg = f"via {payment_method}" + (
                f" ending in {body.card_last4}" if body.card_last4 else ""
            )

        return {
            "success": True,
            "message": f"Successfully deposited Le {amount_sll:,.0f} {detail_msg}!",
            "transaction_id": txn_id,
            "amount_sll": amount_sll,
            "amount_usd": to_usd(amount_sll),
            "payment_method": payment_method,
            "new_balance_sll": new_balance,
            "status": "completed",
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Deposit failed: {str(e)}",
        )


@router.post("/withdraw")
async def withdraw_funds(
    body: WithdrawRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Withdraw funds (SLL) — accepts a JSON body with amount_sll, payment_method, account_details."""
    amount_sll = body.amount_sll
    payment_method = body.payment_method
    account_details = body.account_details

    all_methods = MOBILE_METHODS | INTERNATIONAL_METHODS
    if payment_method not in all_methods:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported payment method. Choose from: {', '.join(sorted(all_methods))}",
        )

    try:
        # Re-query user within THIS session to avoid cross-session DetachedInstanceError
        user = db.query(User).filter(User.id == current_user.id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        current_balance = user.balance_sll if user.balance_sll is not None else 0.0

        if current_balance < amount_sll:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient funds. Your balance is Le {current_balance:,.0f}",
            )

        user.balance_sll = current_balance - amount_sll
        db.commit()
        db.refresh(user)

        new_balance = user.balance_sll
        txn_id = f"WTH-{int(datetime.utcnow().timestamp())}"

        return {
            "success": True,
            "message": f"Successfully withdrew Le {amount_sll:,.0f} to {payment_method} ({account_details})!",
            "transaction_id": txn_id,
            "amount_sll": amount_sll,
            "amount_usd": to_usd(amount_sll),
            "payment_method": payment_method,
            "account_details": account_details,
            "new_balance_sll": new_balance,
            "status": "completed",
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Withdraw failed: {str(e)}",
        )
