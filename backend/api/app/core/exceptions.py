from fastapi import HTTPException, status

class TradingException(HTTPException):
    """Base exception for trading operations"""
    
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)

class InsufficientFundsException(TradingException):
    """Exception for insufficient funds"""
    
    def __init__(self, detail: str = "Insufficient funds"):
        super().__init__(detail=detail, status_code=status.HTTP_400_BAD_REQUEST)

class InvalidSignalException(TradingException):
    """Exception for invalid trading signals"""
    
    def __init__(self, detail: str = "Invalid trading signal"):
        super().__init__(detail=detail, status_code=status.HTTP_400_BAD_REQUEST)

class MarketDataException(TradingException):
    """Exception for market data errors"""
    
    def __init__(self, detail: str = "Market data error"):
        super().__init__(detail=detail, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)