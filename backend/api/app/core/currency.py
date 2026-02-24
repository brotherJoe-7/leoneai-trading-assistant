"""
Currency conversion utilities for LeoneAI
Exchange Rate: 1 USD = 23.70 SLL (New Leone)
"""

# Exchange rates
EXCHANGE_RATE_USD_SLL = 23.70  # 1 USD = 23.70 SLL (New Leone)
EXCHANGE_RATE_SLL_USD = 1.0 / 23.70


def to_sll(usd_amount: float) -> float:
    """Convert USD to SLL"""
    if usd_amount is None:
        return 0.0
    return usd_amount * EXCHANGE_RATE_USD_SLL


def to_usd(sll_amount: float) -> float:
    """Convert SLL to USD"""
    if sll_amount is None:
        return 0.0
    return sll_amount * EXCHANGE_RATE_SLL_USD


def format_sll(amount: float) -> str:
    """Format SLL amount with proper formatting"""
    if amount is None:
        return "Le 0.00"
    return f"Le {amount:,.2f}"


def format_usd(amount: float) -> str:
    """Format USD amount"""
    if amount is None:
        return "$0.00"
    return f"${amount:,.2f}"
