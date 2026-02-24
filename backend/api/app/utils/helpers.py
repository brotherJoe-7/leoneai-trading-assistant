from datetime import datetime
import json

class APIHelpers:
    """Helper functions for API"""
    
    @staticmethod
    def format_response(data: any, success: bool = True, message: str = None) -> dict:
        """Format API response"""
        response = {
            "success": success,
            "timestamp": datetime.now().isoformat(),
            "data": data
        }
        
        if message:
            response["message"] = message
        
        return response
    
    @staticmethod
    def format_error(message: str, error_code: str = None) -> dict:
        """Format error response"""
        return {
            "success": False,
            "timestamp": datetime.now().isoformat(),
            "error": {
                "message": message,
                "code": error_code
            }
        }
    
    @staticmethod
    def validate_request_body(required_fields: list, request_body: dict) -> list:
        """Validate required fields in request body"""
        missing_fields = []
        
        for field in required_fields:
            if field not in request_body or request_body[field] is None:
                missing_fields.append(field)
        
        return missing_fields