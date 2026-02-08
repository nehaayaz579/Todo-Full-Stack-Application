from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlmodel import Session
from config import settings


def get_engine():
    if settings.DATABASE_URL.startswith("sqlite"):
        engine = create_engine(
            settings.DATABASE_URL,
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
    else:
        engine = create_engine(settings.DATABASE_URL)
    return engine


def get_session():
    engine = get_engine()
    with Session(engine) as session:
        yield session