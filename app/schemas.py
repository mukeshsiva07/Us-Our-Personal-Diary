"""
Pydantic schemas for request and response validation.
"""

from pydantic import BaseModel


class LoginRequest(BaseModel):
    """Body of POST /login."""

    username: str
    password: str


class LoginResponse(BaseModel):
    """Returned on successful login."""

    message: str
    username: str

