"""
Comprehensive logging configuration
"""

import logging
import sys
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler
from pathlib import Path

# Create logs directory
LOGS_DIR = Path("logs")
LOGS_DIR.mkdir(exist_ok=True)


# Custom formatter with colors for console
class ColoredFormatter(logging.Formatter):
    """Colored log formatter for console output"""

    COLORS = {
        "DEBUG": "\033[36m",  # Cyan
        "INFO": "\033[32m",  # Green
        "WARNING": "\033[33m",  # Yellow
        "ERROR": "\033[31m",  # Red
        "CRITICAL": "\033[35m",  # Magenta
    }
    RESET = "\033[0m"

    def format(self, record):
        log_color = self.COLORS.get(record.levelname, self.RESET)
        record.levelname = f"{log_color}{record.levelname}{self.RESET}"
        return super().format(record)


def setup_logging(app_name: str = "leoneai", level: str = "INFO"):
    """
    Setup comprehensive logging for the application

    Args:
        app_name: Name of the application
        level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    """
    # Get root logger
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, level.upper()))

    # Remove existing handlers
    logger.handlers.clear()

    # Console handler with colors
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_formatter = ColoredFormatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)

    # File handler - General logs (rotating by size)
    file_handler = RotatingFileHandler(
        LOGS_DIR / f"{app_name}.log", maxBytes=10 * 1024 * 1024, backupCount=5  # 10MB
    )
    file_handler.setLevel(logging.DEBUG)
    file_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)

    # Error handler - Only errors (rotating daily)
    error_handler = TimedRotatingFileHandler(
        LOGS_DIR / f"{app_name}_errors.log", when="midnight", interval=1, backupCount=30
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(file_formatter)
    logger.addHandler(error_handler)

    # Security handler - Security-related logs
    security_handler = RotatingFileHandler(
        LOGS_DIR / f"{app_name}_security.log", maxBytes=10 * 1024 * 1024, backupCount=10
    )
    security_handler.setLevel(logging.WARNING)
    security_handler.setFormatter(file_formatter)

    # Add security handler to security logger
    security_logger = logging.getLogger("security")
    security_logger.addHandler(security_handler)

    logger.info(f"Logging initialized for {app_name} at level {level}")
    return logger


# Create specialized loggers
def get_logger(name: str) -> logging.Logger:
    """Get a logger instance"""
    return logging.getLogger(name)


def log_security_event(event_type: str, details: dict, level: str = "WARNING"):
    """
    Log security-related events

    Args:
        event_type: Type of security event (e.g., 'failed_login', 'rate_limit', 'invalid_token')
        details: Dictionary with event details
        level: Log level
    """
    security_logger = logging.getLogger("security")
    log_func = getattr(security_logger, level.lower())
    log_func(f"SECURITY EVENT: {event_type} - {details}")


def log_trade_execution(user_id: int, trade_data: dict):
    """Log trade execution for audit trail"""
    trade_logger = logging.getLogger("trades")
    trade_logger.info(f"Trade executed - User: {user_id}, Data: {trade_data}")


def log_api_request(
    method: str, path: str, user_id: int = None, status_code: int = None
):
    """Log API requests for monitoring"""
    api_logger = logging.getLogger("api")
    api_logger.info(f"{method} {path} - User: {user_id} - Status: {status_code}")
