from pydantic import BaseModel
from typing import Optional, Any


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    message: str
    username: str


class EntryIn(BaseModel):
    section: str
    title: str
    date: str
    coverUrl: Optional[str] = None
    coverOffsetY: Optional[float] = None
    icon: Optional[str] = None
    content: Any
    drawingLayer: Optional[str] = None
    mediaItems: list = []
    povContent: Optional[dict] = None


class EntryOut(EntryIn):
    id: str