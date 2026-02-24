"""
Rate limiting middleware for API endpoints
"""

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, Response
from fastapi.responses import JSONResponse

# Initialize limiter
limiter = Limiter(key_func=get_remote_address)


# Rate limit error handler
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    """Handle rate limit exceeded errors"""
    return JSONResponse(
        status_code=429,
        content={
            "error": "Rate limit exceeded",
            "detail": "Too many requests. Please try again later.",
            "retry_after": exc.detail,
        },
    )


# Common rate limit decorators
def rate_limit_strict(func):
    """Strict rate limit: 5 requests per minute"""
    return limiter.limit("5/minute")(func)


def rate_limit_moderate(func):
    """Moderate rate limit: 30 requests per minute"""
    return limiter.limit("30/minute")(func)


def rate_limit_relaxed(func):
    """Relaxed rate limit: 100 requests per minute"""
    return limiter.limit("100/minute")(func)
