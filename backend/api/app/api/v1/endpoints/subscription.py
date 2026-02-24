from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.user import User
from app.services.subscription_service import subscription_service
from app.models.subscription import PlanType
from pydantic import BaseModel

router = APIRouter()


from app.schemas.subscription import SubscriptionResponse, SubscriptionUpdate


@router.get("/me", response_model=SubscriptionResponse)
def get_my_subscription(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Get current user subscription"""
    sub = subscription_service.get_current_subscription(db, current_user.id)
    if not sub:
        # If no subscription found, create a default FREE one
        sub = subscription_service.create_subscription(
            db, current_user.id, PlanType.FREE
        )
    return sub


@router.post("/upgrade", response_model=SubscriptionResponse)
def upgrade_subscription(
    plan_data: SubscriptionUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Upgrade subscription plan"""
    # Validation
    allowed = {"FREE", "PRO", "PREMIUM", "ENTERPRISE"}
    plan_val = (
        plan_data.plan_type.upper()
        if isinstance(plan_data.plan_type, str)
        else str(plan_data.plan_type)
    )
    if plan_val not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid plan type. Must be one of: {', '.join(allowed)}",
        )

    sub = subscription_service.upgrade_subscription(db, current_user.id, plan_val)
    return SubscriptionResponse.model_validate(sub)


@router.post("/cancel")
def cancel_subscription(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
):
    """Cancel subscription (Downgrade into FREE)"""
    success = subscription_service.cancel_subscription(db, current_user.id)
    if not success:
        raise HTTPException(status_code=400, detail="No active subscription found")
    return {
        "status": "success",
        "message": "Subscription cancelled and reverted to FREE",
    }
