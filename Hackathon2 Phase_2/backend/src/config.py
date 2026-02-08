from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./todo_app.db"  # Default to SQLite for development
    SECRET_KEY: str = "your-secret-key-change-in-production"
    DEBUG: bool = True
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    BETTER_AUTH_SECRET: str = ""

    class Config:
        env_file = ".env"

    def __init__(self, **values):
        super().__init__(**values)
        # Use BETTER_AUTH_SECRET as SECRET_KEY if it's set
        if self.BETTER_AUTH_SECRET:
            self.SECRET_KEY = self.BETTER_AUTH_SECRET


settings = Settings()