from sqlalchemy import Column, Integer, String, Float, Text, JSON
from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)


class Entry(Base):
    __tablename__ = "entries"

    id = Column(String(64), primary_key=True, index=True)
    section = Column(String(20), nullable=False, index=True)  # mukesh | anne | combined
    title = Column(String(300), nullable=False)
    date = Column(String(20), nullable=False)
    cover_url = Column(Text, nullable=True)
    cover_offset_y = Column(Float, nullable=True)
    icon = Column(String(10), nullable=True)
    content = Column(JSON, nullable=False)
    drawing_layer = Column(Text, nullable=True)
    media_items = Column(JSON, nullable=False, default=list)
    pov_content = Column(JSON, nullable=True)