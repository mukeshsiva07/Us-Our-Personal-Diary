"""
SQLAlchemy database engine, session factory, and declarative base.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from app.config import settings

engine = create_engine(settings.database_url)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""
    pass


def get_db():
    """FastAPI dependency that yields a database session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

