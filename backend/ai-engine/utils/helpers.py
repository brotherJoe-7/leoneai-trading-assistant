import json
from datetime import datetime, timedelta
from typing import Any, Dict

class Helpers:
    """Utility helper functions"""
    
    @staticmethod
    def format_price(price: float, currency: str = "USD") -> str:
        """Format price with currency symbol"""
        if currency == "USD":
            return f"${price:,.2f}"
        elif currency == "SLL":
            return f"Le {price:,.2f}"
        else:
            return f"{price:,.2f} {currency}"
    
    @staticmethod
    def convert_to_leone(usd_amount: float, exchange_rate: float = 22000) -> float:
        """Convert USD to Sierra Leone Leone"""
        return usd_amount * exchange_rate
    
    @staticmethod
    def calculate_percentage_change(old_value: float, new_value: float) -> float:
        """Calculate percentage change"""
        if old_value == 0:
            return 0
        return ((new_value - old_value) / old_value) * 100
    
    @staticmethod
    def format_timestamp(timestamp: datetime) -> str:
        """Format timestamp for display"""
        return timestamp.strftime("%Y-%m-%d %H:%M:%S")
    
    @staticmethod
    def safe_json_serialize(obj: Any) -> str:
        """Safely serialize object to JSON"""
        def default_serializer(o):
            if isinstance(o, datetime):
                return o.isoformat()
            raise TypeError(f"Object of type {type(o)} is not JSON serializable")
        
        return json.dumps(obj, default=default_serializer)