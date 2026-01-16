"""
Core configuration settings
"""
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "StudyCopilot"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["*"]  # Allow all origins for testing
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    SUPABASE_JWT_SECRET: str
    
    # OpenAI
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"
    
    # Development Mode
    DEV_MODE: bool = False
    
    # Database
    DATABASE_URL: str = ""
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = [".pdf"]
    
    # RAG Settings
    CHUNK_SIZE: int = 800 # Reduced chunk size for more granular retrieval
    CHUNK_OVERLAP: int = 100
    TOP_K_RESULTS: int = 20 # Increased from 5 to 20 for broader context
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
