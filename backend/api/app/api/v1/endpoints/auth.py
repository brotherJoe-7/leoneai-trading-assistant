from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from app.dependencies.database import get_db
from app.core.security import create_access_token
from app.core.config import settings
from app.crud.user import user as crud_user
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """Login endpoint - Returns access token, refresh token, and user data"""
    import logging
    from app.core.logging_config import log_security_event

    logger = logging.getLogger(__name__)

    # Authenticate user
    user = crud_user.authenticate(
        db, username=form_data.username, password=form_data.password
    )

    if not user:
        # Log failed login attempt
        log_security_event(
            "failed_login",
            {
                "username": form_data.username,
                "ip": "unknown",  # Can be extracted from request if needed
            },
            level="WARNING",
        )

        logger.warning(f"Failed login attempt for username: {form_data.username}")

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    # Log successful login
    log_security_event(
        "successful_login",
        {"user_id": user.id, "username": user.username},
        level="INFO",
    )

    logger.info(f"Successful login - User: {user.username} (ID: {user.id})")

    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    # Create refresh token (longer expiration)
    refresh_token_expires = timedelta(days=7)  # 7 days
    refresh_token = create_access_token(
        data={"sub": user.username, "type": "refresh"},
        expires_delta=refresh_token_expires,
    )

    # Return tokens AND user data to avoid second API call
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "is_active": user.is_active,
            "is_superuser": user.is_superuser,
        },
    }


@router.post("/refresh")
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    """Refresh access token using refresh token"""
    from app.core.security import decode_token

    try:
        # Decode and validate refresh token
        payload = decode_token(refresh_token)
        username = payload.get("sub")
        token_type = payload.get("type")

        if not username or token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
            )

        # Get user
        user = crud_user.get_by_username(db, username=username)
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive",
            )

        # Create new access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        new_access_token = create_access_token(
            data={"sub": user.username}, expires_delta=access_token_expires
        )

        # Optionally create new refresh token (token rotation)
        new_refresh_token_expires = timedelta(days=7)
        new_refresh_token = create_access_token(
            data={"sub": user.username, "type": "refresh"},
            expires_delta=new_refresh_token_expires,
        )

        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate refresh token",
        )


@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """User registration endpoint"""
    # Check if user already exists
    user = crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    user = crud_user.get_by_username(db, username=user_in.username)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken"
        )

    # Create new user
    user = crud_user.create(db, obj_in=user_in)
    return user
