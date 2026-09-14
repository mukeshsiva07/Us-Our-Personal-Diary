"""
Create a test user in the database.

Usage:
    .venv\\Scripts\\python.exe scripts/create_test_user.py <username> <password>

The password is hashed with bcrypt before being stored.
"""

import sys
import os

# Ensure the project root is on the Python path so `app` can be imported.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, Base, engine
from app.models import User
from app.auth import hash_password


def main():
    if len(sys.argv) != 3:
        print("Usage: python scripts/create_test_user.py <username> <password>")
        sys.exit(1)

    username = sys.argv[1]
    password = sys.argv[2]

    # Ensure the users table exists.
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.username == username).first()
        if existing:
            print(f"User '{username}' already exists. No changes made.")
            sys.exit(0)

        user = User(username=username, password_hash=hash_password(password))
        db.add(user)
        db.commit()
        print(f"Test user '{username}' created successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    main()

