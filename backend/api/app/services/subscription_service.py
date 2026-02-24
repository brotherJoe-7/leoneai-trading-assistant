from sqlalchemy.orm import Session
from app.models.subscription import Subscription, PlanType
from app.models.user import User
from datetime import datetime
from typing import Optional


class SubscriptionService:

    def get_current_subscription(
        self, db: Session, user_id: int
    ) -> Optional[Subscription]:
        return (
            db.query(Subscription)
            .filter(Subscription.user_id == user_id, Subscription.is_active == True)
            .first()
        )

    def create_subscription(
        self, db: Session, user_id: int, plan_type: str = PlanType.FREE
    ) -> Subscription:
        # Check if user already has active subscription
        existing_sub = self.get_current_subscription(db, user_id)
        if existing_sub:
            if existing_sub.plan_type == plan_type:
                return existing_sub  # Already on this plan
            # If upgrading/downgrading, deactivate old one first? Or update?
            # For simplicity, we deactivate old and categorize as new for now
            existing_sub.is_active = False
            existing_sub.end_date = datetime.utcnow()
            db.add(existing_sub)

        new_sub = Subscription(
            user_id=user_id,
            plan_type=str(plan_type),
            is_active=True,
            start_date=datetime.utcnow(),
        )
        db.add(new_sub)

        # Update user convenience field
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            user.plan_type = plan_type
            db.add(user)

        db.commit()
        db.refresh(new_sub)
        return new_sub

    def upgrade_subscription(
        self, db: Session, user_id: int, new_plan_type: str
    ) -> Subscription:
        return self.create_subscription(db, user_id, new_plan_type)

    def cancel_subscription(self, db: Session, user_id: int) -> bool:
        sub = self.get_current_subscription(db, user_id)
        if sub:
            sub.is_active = False
            sub.end_date = datetime.utcnow()

            # Revert user to FREE
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                user.plan_type = PlanType.FREE
                db.add(user)

                # Create a new FREE subscription implicitly? Or just leave no active sub = free?
                # Let's create a free sub to be explicit
                free_sub = Subscription(
                    user_id=user_id,
                    plan_type=PlanType.FREE,
                    is_active=True,
                    start_date=datetime.utcnow(),
                )
                db.add(free_sub)

            db.commit()
            return True
        return False


subscription_service = SubscriptionService()
