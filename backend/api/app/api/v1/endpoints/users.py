from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.api.deps import get_current_active_user, get_db
from app.models.user import User

router = APIRouter()


# ── Schemas ────────────────────────────────────────────────────────
class UserSettingsUpdate(BaseModel):
    full_name: Optional[str] = None
    country: Optional[str] = None
    currency_preference: Optional[str] = None
    risk_tolerance: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    email_alerts: Optional[bool] = None
    push_notifications: Optional[bool] = None
    dark_mode: Optional[bool] = None
    language: Optional[str] = None


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


# ── GET /users/me ─────────────────────────────────────────────────
@router.get("/me")
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user),
):
    """Return full profile for the logged-in user."""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name or current_user.username,
        "country": current_user.country or "Sierra Leone",
        "currency_preference": current_user.currency_preference or "SLL",
        "risk_tolerance": current_user.risk_tolerance or "MODERATE",
        "plan_type": current_user.plan_type or "FREE",
        "is_verified": current_user.is_verified,
        "balance_sll": current_user.balance_sll or 0.0,
        "balance_usd": current_user.balance_usd or 0.0,
        "created_at": str(current_user.created_at) if current_user.created_at else None,
        "preferences": {
            "notifications_enabled": current_user.notifications_enabled,
            "email_alerts": current_user.email_alerts,
            "push_notifications": current_user.push_notifications,
            "dark_mode": current_user.dark_mode,
            "language": current_user.language or "en",
        },
    }


# ── PATCH /users/me ───────────────────────────────────────────────
@router.patch("/me")
async def update_user_settings(
    body: UserSettingsUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Update profile and notification preferences."""
    # Re-query user in current session
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = body.dict(exclude_unset=True)
    for field, value in update_data.items():
        if hasattr(user, field) and value is not None:
            setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "message": "Settings saved successfully!",
        "user": {
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "country": user.country,
            "currency_preference": user.currency_preference,
            "risk_tolerance": user.risk_tolerance,
            "preferences": {
                "notifications_enabled": user.notifications_enabled,
                "email_alerts": user.email_alerts,
                "push_notifications": user.push_notifications,
                "dark_mode": user.dark_mode,
                "language": user.language,
            },
        },
    }


# ── POST /users/me/change-password ────────────────────────────────
@router.post("/me/change-password")
async def change_password(
    body: PasswordChange,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Change the logged-in user's password."""
    from app.core.security import verify_password, get_password_hash

    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(body.current_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    if len(body.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters",
        )

    user.hashed_password = get_password_hash(body.new_password)
    db.commit()
    return {"success": True, "message": "Password changed successfully!"}
