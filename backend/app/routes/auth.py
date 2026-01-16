"""
Authentication routes
"""
from fastapi import APIRouter, Depends
from app.core.auth import get_current_user

router = APIRouter()

@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user information"""
    return {
        "user_id": current_user["user_id"],
        "email": current_user["email"],
        "role": current_user["role"]
    }
