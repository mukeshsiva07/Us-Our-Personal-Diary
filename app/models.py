"""
SQLAlchemy ORM models.
"""

from sqlalchemy import Column, Integer, String

from app.database import Base


class User(Base):
    """Represents a row in the 'users' table."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)

