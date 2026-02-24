"""
Input sanitization utilities
"""

import re
from typing import Any, Optional


def sanitize_string(
    value: str, max_length: int = 255, allow_special: bool = False
) -> str:
    """
    Sanitize string input to prevent injection attacks

    Args:
        value: Input string to sanitize
        max_length: Maximum allowed length
        allow_special: Whether to allow special characters

    Returns:
        Sanitized string

    Raises:
        ValueError: If input is invalid
    """
    if not isinstance(value, str):
        raise ValueError("Input must be a string")

    # Trim whitespace
    value = value.strip()

    # Check length
    if len(value) > max_length:
        raise ValueError(f"Input exceeds maximum length of {max_length}")

    # Remove null bytes
    value = value.replace("\x00", "")

    # If special characters not allowed, only keep alphanumeric and basic punctuation
    if not allow_special:
        value = re.sub(r"[^\w\s\-_.,@]", "", value)

    return value


def sanitize_symbol(symbol: str) -> str:
    """
    Sanitize trading symbol

    Args:
        symbol: Trading symbol (e.g., 'BTC-USD')

    Returns:
        Sanitized symbol

    Raises:
        ValueError: If symbol is invalid
    """
    symbol = symbol.strip().upper()

    # Only allow alphanumeric, dash, slash, and underscore
    if not re.match(r"^[A-Z0-9\-/_]+$", symbol):
        raise ValueError("Invalid symbol format")

    if len(symbol) > 20:
        raise ValueError("Symbol too long")

    return symbol


def sanitize_numeric(
    value: Any, min_value: Optional[float] = None, max_value: Optional[float] = None
) -> float:
    """
    Sanitize numeric input

    Args:
        value: Numeric value to sanitize
        min_value: Minimum allowed value
        max_value: Maximum allowed value

    Returns:
        Sanitized numeric value

    Raises:
        ValueError: If value is invalid
    """
    try:
        num_value = float(value)
    except (TypeError, ValueError):
        raise ValueError("Invalid numeric value")

    # Check for special float values
    if not (num_value == num_value):  # NaN check
        raise ValueError("Value cannot be NaN")

    if num_value == float("inf") or num_value == float("-inf"):
        raise ValueError("Value cannot be infinity")

    # Check bounds
    if min_value is not None and num_value < min_value:
        raise ValueError(f"Value must be at least {min_value}")

    if max_value is not None and num_value > max_value:
        raise ValueError(f"Value must be at most {max_value}")

    return num_value


def validate_email(email: str) -> str:
    """
    Validate and sanitize email address

    Args:
        email: Email address to validate

    Returns:
        Sanitized email

    Raises:
        ValueError: If email is invalid
    """
    email = email.strip().lower()

    # Basic email regex
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    if not re.match(email_pattern, email):
        raise ValueError("Invalid email format")

    if len(email) > 255:
        raise ValueError("Email too long")

    return email


def validate_username(username: str) -> str:
    """
    Validate and sanitize username

    Args:
        username: Username to validate

    Returns:
        Sanitized username

    Raises:
        ValueError: If username is invalid
    """
    username = username.strip().lower()

    # Only allow alphanumeric, underscore, and dash
    if not re.match(r"^[a-z0-9_-]+$", username):
        raise ValueError(
            "Username can only contain letters, numbers, underscores, and dashes"
        )

    if len(username) < 3:
        raise ValueError("Username must be at least 3 characters")

    if len(username) > 50:
        raise ValueError("Username must be at most 50 characters")

    return username


def sanitize_sql_like_pattern(pattern: str) -> str:
    """
    Sanitize pattern for SQL LIKE queries

    Args:
        pattern: Search pattern

    Returns:
        Sanitized pattern
    """
    # Escape special SQL LIKE characters
    pattern = pattern.replace("\\", "\\\\")
    pattern = pattern.replace("%", "\\%")
    pattern = pattern.replace("_", "\\_")

    return pattern
