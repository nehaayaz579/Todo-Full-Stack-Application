from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List
import re


class UserBase(SQLModel):
    email: str = Field(
        regex=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
        max_length=255,
        unique=True
    )


class User(UserBase, table=True):
    id: int = Field(primary_key=True)
    hashed_password: str = Field(max_length=1000)  # Increase size to accommodate bcrypt hash
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    # Relationship to tasks
    tasks: List["Task"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=72)  # Raw password before hashing


class UserLogin(SQLModel):
    email: str
    password: str  # Raw password to be verified against hash


class UserResponse(SQLModel):
    id: int
    email: str
    created_at: datetime
    updated_at: Optional[datetime] = None