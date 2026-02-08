from sqlmodel import SQLModel
from datetime import datetime
from typing import Optional
import re


class UserBase(SQLModel):
    email: str


class UserCreate(UserBase):
    password: str


class UserLogin(SQLModel):
    email: str
    password: str


class UserResponse(SQLModel):
    id: int
    email: str
    created_at: datetime
    updated_at: Optional[datetime] = None


class LoginResponse(SQLModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"


class RefreshTokenRequest(SQLModel):
    refresh_token: str


class TokenRefreshResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"