from fastapi import APIRouter, Depends
from typing import Optional

from app.dependencies.auth import get_current_user

router = APIRouter()

@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return {
        "user": {
            "username": current_user.get("sub", "demo"),
            "email": "demo@leoneai.com",
            "country": "Sierra Leone",
            "currency_preference": "SLL",
            "risk_tolerance": "MODERATE",
            "joined_date": "2026-01-01",
            "account_type": "DEMO"
        },
        "preferences": {
            "notifications": True,
            "email_alerts": True,
            "push_notifications": True,
            "dark_mode": True,
            "language": "en"
        }
    }

@router.put("/preferences")
async def update_preferences(
    notifications: Optional[bool] = None,
    email_alerts: Optional[bool] = None,
    dark_mode: Optional[bool] = None,
    language: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Update user preferences"""
    # TODO: Implement actual preference saving
    return {
        "message": "Preferences updated successfully",
        "updated_preferences": {
            "notifications": notifications,
            "email_alerts": email_alerts,
            "dark_mode": dark_mode,
            "language": language
        }
    }