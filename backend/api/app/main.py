import re
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import time
import logging

from app.core.config import settings
from app.api.v1.router import api_router
from app.db.base_class import Base
from app.db.session import engine
from app.core.logging_config import setup_logging, log_api_request, log_security_event

# Initialize logging
setup_logging(app_name="leoneai", level="INFO")
logger = logging.getLogger(__name__)

# Create tables with error handling
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Database initialization error: {e}")
    logger.warning("Continuing without database - some features may not work")

app = FastAPI(
    title="LeoneAI Trading API",
    description="API for LeoneAI Trading Assistant - Sierra Leone",
    version="1.0.0",
)


def is_allowed_origin(origin: str) -> bool:
    """Return True for localhost, *.vercel.app and *.railway.app origins."""
    if not origin:
        return False
    if origin.startswith("http://localhost:") or origin.startswith("http://127.0.0.1:"):
        return True
    if origin.startswith("https://") and origin.endswith(".vercel.app"):
        return True
    if origin.startswith("https://") and origin.endswith(".railway.app"):
        return True
    return False


CORS_HEADERS = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept, Origin, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin",
}


@app.middleware("http")
async def cors_middleware(request: Request, call_next):
    """Dynamic CORS — allows all *.vercel.app / *.railway.app / localhost origins."""
    origin = request.headers.get("origin", "")

    # Handle preflight OPTIONS request
    if request.method == "OPTIONS":
        headers = {"Access-Control-Allow-Origin": origin or "*", **CORS_HEADERS}
        return JSONResponse(status_code=200, content={}, headers=headers)

    # Process normal request
    response = await call_next(request)

    # Inject CORS headers on all responses
    if is_allowed_origin(origin):
        response.headers["Access-Control-Allow-Origin"] = origin
        for key, value in CORS_HEADERS.items():
            response.headers[key] = value

    return response


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all API requests for monitoring and security"""
    start_time = time.time()

    # Get user ID from token if available
    user_id = None
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        try:
            from app.core.security import verify_token

            token = auth_header.split(" ")[1]
            payload = verify_token(token)
            if payload:
                user_id = payload.get("sub")
        except Exception:
            pass

    # Process request
    try:
        response = await call_next(request)
        process_time = time.time() - start_time

        # Log request
        log_api_request(
            method=request.method,
            path=request.url.path,
            user_id=user_id,
            status_code=response.status_code,
        )

        # Add processing time header
        response.headers["X-Process-Time"] = str(process_time)

        return response
    except Exception as e:
        logger.error(
            f"Request failed: {request.method} {request.url.path} - Error: {str(e)}",
            exc_info=True,
        )
        log_security_event(
            "request_error",
            {
                "method": request.method,
                "path": request.url.path,
                "user_id": user_id,
                "error": str(e),
            },
            level="ERROR",
        )

        return JSONResponse(
            status_code=500, content={"detail": "Internal server error"}
        )


# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add security headers to all responses"""
    response = await call_next(request)

    # Content Security Policy — allow TradingView, Binance, Google Fonts
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' "
        "  https://s.tradingview.com https://widget.tradingview.com "
        "  https://accounts.google.com https://appleid.cdn-apple.com; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "img-src 'self' data: https:; "
        "font-src 'self' data: https://fonts.gstatic.com; "
        "connect-src 'self' "
        "  https://api.binance.com wss://stream.binance.com "
        "  https://api.coingecko.com "
        "  https://*.vercel.app https://*.railway.app; "
        "frame-src 'self' "
        "  https://s.tradingview.com https://widget.tradingview.com "
        "  https://accounts.google.com https://appleid.apple.com;"
    )

    # Prevent MIME type sniffing
    response.headers["X-Content-Type-Options"] = "nosniff"

    # Prevent clickjacking
    response.headers["X-Frame-Options"] = "DENY"

    # XSS Protection
    response.headers["X-XSS-Protection"] = "1; mode=block"

    # Referrer Policy
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

    # Permissions Policy
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

    return response


# Include routers
app.include_router(api_router, prefix="/api/v1")


@app.on_event("startup")
async def startup_event():
    """Log startup and seed default users if DB is empty."""
    logger.info("LeoneAI Trading API starting up...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"CORS Origins: dynamic (*.vercel.app, *.railway.app, localhost)")
    await seed_default_users()


async def seed_default_users():
    """Create default accounts if they don't exist (safe to run every startup)."""
    from app.db.session import SessionLocal
    from app.crud.user import user as crud_user
    from app.schemas.user import UserCreate

    default_users = [
        UserCreate(
            username="admin",
            email="admin@leoneai.com",
            password="admin123",
            full_name="Admin User",
            country="Sierra Leone",
            currency_preference="SLL",
        ),
        UserCreate(
            username="demo",
            email="demo@leoneai.com",
            password="demo123",
            full_name="Demo User",
            country="Sierra Leone",
            currency_preference="SLL",
        ),
        UserCreate(
            username="brotherjoe",
            email="brotherjoe@leoneai.com",
            password="joe2026",
            full_name="Brother Joe",
            country="Sierra Leone",
            currency_preference="SLL",
        ),
    ]

    db = SessionLocal()
    try:
        for user_data in default_users:
            existing = crud_user.get_by_username(db, username=user_data.username)
            if not existing:
                crud_user.create(db, obj_in=user_data)
                logger.info(f"Created default user: {user_data.username}")
            else:
                logger.info(f"User already exists: {user_data.username}")
    except Exception as e:
        logger.error(f"Failed to seed users: {e}")
    finally:
        db.close()


@app.on_event("shutdown")
async def shutdown_event():
    """Log application shutdown"""
    logger.info("LeoneAI Trading API shutting down...")


@app.get("/")
async def root():
    return {"message": "LeoneAI Trading API", "version": "1.0.0", "docs": "/docs"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_DEBUG,
    )
