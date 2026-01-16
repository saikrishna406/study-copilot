"""
Authentication middleware and utilities
"""
from fastapi import HTTPException, Security, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.config import settings
from supabase import create_client, Client
from typing import Optional

security = HTTPBearer(auto_error=not settings.DEV_MODE)  # Don't auto-error in dev mode

_supabase_client: Optional[Client] = None

def get_supabase_client() -> Client:
    """Get Supabase client instance (Singleton)"""
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    return _supabase_client

async def verify_token(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> dict:
    """
    Verify Supabase JWT token
    Returns user data if valid
    In DEV_MODE, returns a test user if no credentials provided
    """
    # Development Mode
    if settings.DEV_MODE:
        # Use a REAL user ID that exists in the database to satisfy Foreign Key constraints
        # ID retrieved for: test@example.com
        TEST_USER_ID = "aeb36718-20fc-4062-858d-93261002b2d2"
        
        if credentials is None:
            print("⚠️  DEV_MODE: Using test user (no authentication required)")
            return {
                "user_id": TEST_USER_ID,
                "email": "test@example.com",
                "role": "user"
            }
    
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    token = credentials.credentials
    
    try:
        # Decode JWT token
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        
        return {
            "user_id": user_id,
            "email": payload.get("email"),
            "role": payload.get("role", "user")
        }
        
    except JWTError as e:
        if settings.DEV_MODE:
            print(f"⚠️  DEV_MODE: JWT validation failed, using test user. Error: {e}")
            return {
                "user_id": "aeb36718-20fc-4062-858d-93261002b2d2",  # Real ID for FK constraints
                "email": "test@example.com",
                "role": "user"
            }
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

async def get_current_user(user_data: dict = Security(verify_token)) -> dict:
    """Dependency to get current authenticated user"""
    return user_data
