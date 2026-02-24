from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.crud.user import user as crud_user
from app.schemas.user import UserCreate
from app.core.config import settings
from app.db.base_class import Base
from app.db.session import engine
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_db(db: Session) -> None:
    # Create admin user
    admin_email = "admin@leoneai.com"
    admin_user = crud_user.get_by_email(db, email=admin_email)
    if not admin_user:
        user_in = UserCreate(
            email=admin_email,
            password="admin123",
            username="admin",
            full_name="System Admin",
        )
        # Create user and then update is_superuser
        user = crud_user.create(db, obj_in=user_in)
        user.is_superuser = True
        user.is_active = True
        db.commit()
        db.refresh(user)
        logger.info(f"Admin user created: {user.email}")
    else:
        logger.info(f"Admin user already exists: {admin_user.email}")


def main() -> None:
    logger.info("Creating initial data")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    init_db(db)
    logger.info("Initial data created")


if __name__ == "__main__":
    main()
