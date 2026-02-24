from app.db.session import SessionLocal
from app.services.subscription_service import subscription_service
from app.models.user import User
from app.models.subscription import PlanType
import traceback


def debug_sub():
    db = SessionLocal()
    try:
        print("Debugging Subscription Service...")

        # 1. Get user
        user = db.query(User).filter(User.username == "testuser").first()
        if not user:
            # Create one for debug if missing
            print("User 'testuser' not found, creating...")
            user = User(
                username="testuser",
                email="test@example.com",
                hashed_password="pw",
                full_name="Test",
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        print(f"User found: {user.username}, ID: {user.id}")

        # 2. Get current subscription
        print("Getting current subscription...")
        sub = subscription_service.get_current_subscription(db, user.id)
        print(f"Current subscription: {sub}")

        # 3. Create subscription
        print("Creating subscription...")
        sub = subscription_service.create_subscription(db, user.id, PlanType.PREMIUM)
        print(f"Created subscription: {sub.plan_type} (Type: {type(sub.plan_type)})")

        # 4. Test serialization
        from app.schemas.subscription import SubscriptionResponse

        print("Validating response schema...")
        response = SubscriptionResponse.model_validate(sub)
        print(f"Serialized: {response.json()}")

    except Exception:
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    debug_sub()
