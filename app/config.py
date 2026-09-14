"""
Application settings loaded from environment variables.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Reads configuration from environment variables (or .env file)."""

    database_url: str  # e.g. postgresql://postgres:pass@localhost:5432/mj_db

    model_config = {"env_file": ".env"}


settings = Settings()

