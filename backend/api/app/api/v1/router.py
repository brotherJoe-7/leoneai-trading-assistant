from fastapi import APIRouter
from app.api.v1.endpoints import auth, market, signals, portfolio, users, admin

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(market.router, prefix="/market", tags=["market"])
api_router.include_router(signals.router, prefix="/signals", tags=["signals"])
api_router.include_router(portfolio.router, prefix="/portfolio", tags=["portfolio"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])

# New Features
from app.api.v1.endpoints import pro_market, copy_trading

api_router.include_router(pro_market.router, prefix="/pro-market", tags=["pro-market"])
api_router.include_router(
    copy_trading.router, prefix="/copy-trading", tags=["copy-trading"]
)

from app.api.v1.endpoints import subscription

api_router.include_router(
    subscription.router, prefix="/subscription", tags=["subscription"]
)
