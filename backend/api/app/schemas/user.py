from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    country: str = "Sierra Leone"
    currency_preference: str = "SLL"

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    currency_preference: Optional[str] = None
    risk_tolerance: Optional[str] = None

class UserInDB(UserBase):
    id: int
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None