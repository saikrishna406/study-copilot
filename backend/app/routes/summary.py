"""
Summary generation routes (placeholder for Phase 3)
"""
from fastapi import APIRouter, Depends
from app.core.auth import get_current_user
from app.models.schemas import SummaryRequest, SummaryResponse

router = APIRouter()

@router.post("/generate", response_model=SummaryResponse)
async def generate_summary(
    request: SummaryRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate summary from documents (to be implemented in Phase 3)"""
    return {
        "id": "placeholder",
        "content": "Summary generation will be implemented in Phase 3",
        "created_at": "2024-01-01T00:00:00Z"
    }
