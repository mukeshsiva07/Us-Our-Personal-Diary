"""
FastAPI application — Module 1: Login Backend.
"""

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import User
from app.schemas import LoginRequest, LoginResponse
from app.auth import verify_password

# Create all tables on startup (safe no-op if they already exist).
Base.metadata.create_all(bind=engine)

app = FastAPI(title="MJ Backend", version="0.1.0")


@app.post("/login", response_model=LoginResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate a user with username and password.

    - Returns 200 with a success message if credentials are valid.
    - Returns 401 if the username does not exist or the password is wrong.
      The error message intentionally does NOT reveal which part was incorrect.
    """
    user = db.query(User).filter(User.username == credentials.username).first()

    if user is None or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
        )

    return LoginResponse(message="Login successful.", username=user.username)

