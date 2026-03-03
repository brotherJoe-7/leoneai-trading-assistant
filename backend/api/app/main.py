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

# ── CORS — allow localhost + all vercel.app and railway.app domains ──────────
ALLOWED_ORIGINS_EXACT = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://leoneai.vercel.app",
    "https://leoneai-trading-assistant.vercel.app",
    "https://leoneai-trading-assistant-9yy0zwcvn-j8288743-8109s-projects.vercel.app",
]


def is_allowed_origin(origin: str) -> bool:
    if origin in ALLOWED_ORIGINS_EXACT:
        return True
    # Allow ALL *.vercel.app subdomains (including long preview URLs)
    if origin.startswith("https://") and origin.endswith(".vercel.app"):
        return True
    # Allow railway.app domains
    if origin.startswith("https://") and origin.endswith(".railway.app"):
        return True
    return False


class DynamicCORSMiddleware:
    """CORS middleware that accepts *.vercel.app via regex."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            headers = dict(scope.get("headers", []))
            origin = headers.get(b"origin", b"").decode("utf-8", errors="ignore")

            async def send_with_cors(message):
                if (
                    message["type"] == "http.response.start"
                    and origin
                    and is_allowed_origin(origin)
                ):
                    headers_list = list(message.get("headers", []))
                    headers_list += [
                        (b"access-control-allow-origin", origin.encode()),
                        (b"access-control-allow-credentials", b"true"),
                        (
                            b"access-control-allow-methods",
                            b"GET, POST, PUT, PATCH, DELETE, OPTIONS",
                        ),
                        (
                            b"access-control-allow-headers",
                            b"*, Authorization, Content-Type",
                        ),
                        (b"vary", b"Origin"),
                    ]
                    message = {**message, "headers": headers_list}
                await send(message)

            # Handle OPTIONS preflight
            if scope["method"] == "OPTIONS" if "method" in scope else False:
                await send(
                    {
                        "type": "http.response.start",
                        "status": 200,
                        "headers": [
                            (
                                b"access-control-allow-origin",
                                origin.encode() if origin else b"*",
                            ),
                            (b"access-control-allow-credentials", b"true"),
                            (
                                b"access-control-allow-methods",
                                b"GET, POST, PUT, PATCH, DELETE, OPTIONS",
                            ),
                            (
                                b"access-control-allow-headers",
                                b"*, Authorization, Content-Type",
                            ),
                            (b"content-length", b"0"),
                        ],
                    }
                )
                await send({"type": "http.response.body", "body": b""})
                return

            await self.app(scope, receive, send_with_cors)
        else:
            await self.app(scope, receive, send)


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS_EXACT,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    """Log application startup"""
    logger.info("LeoneAI Trading API starting up...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"CORS Origins: {settings.CORS_ORIGINS}")


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
