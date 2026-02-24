from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings"""

    # API
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # Database
    DATABASE_URL: str = "sqlite:///./leoneai.db"

    # JWT
    JWT_SECRET_KEY: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS — add your Vercel URL here after deploying
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        # Production — update with your actual Vercel URL
        "https://leoneai.vercel.app",
        "https://leoneai-trading-assistant.vercel.app",
        # Allow all vercel preview URLs
        "https://*.vercel.app",
    ]

    # Environment
    ENVIRONMENT: str = "development"

    # AI Engine
    AI_ENGINE_URL: str = "http://localhost:8001"

    class Config:
        env_file = ".env"


settings = Settings()
