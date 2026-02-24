from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app.api import deps
from app.crud import admin as crud_admin
from app.crud import user as crud_user
from app.schemas import admin as admin_schema
from app.schemas import user as user_schema
from app.models.user import User

router = APIRouter()


@router.get("/dashboard", response_model=admin_schema.AdminDashboardData)
def get_admin_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get admin dashboard stats and recent activity.
    """
    dashboard_data = crud_admin.admin.get_dashboard_data(db)
    return dashboard_data


@router.get("/users", response_model=List[user_schema.UserResponse])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    users = crud_user.user.get_multi(db, skip=skip, limit=limit)
    return users


@router.post("/users", response_model=user_schema.UserResponse)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: user_schema.UserCreate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new user by admin.
    """
    user = crud_user.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = crud_user.user.create(db, obj_in=user_in)
    return user


@router.put("/users/{user_id}", response_model=user_schema.UserResponse)
def update_user(
    *,
    db: Session = Depends(deps.get_db),
    user_id: int,
    user_in: admin_schema.AdminUserUpdate,
    current_user: User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update a user.
    """
    user = crud_user.user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="The user with this id does not exist in the system",
        )
    user = crud_user.user.update(db, db_obj=user, obj_in=user_in)
    return user
