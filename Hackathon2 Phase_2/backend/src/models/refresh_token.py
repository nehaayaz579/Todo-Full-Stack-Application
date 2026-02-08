from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional


class RefreshToken(SQLModel, table=True):
    id: int = Field(primary_key=True)
    token: str = Field(unique=True, max_length=500)
    user_id: int = Field(foreign_key="user.id")
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    revoked: bool = Field(default=False)