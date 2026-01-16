"""
Notes generation routes (placeholder for Phase 3)
"""
from fastapi import APIRouter, Depends
from app.core.auth import get_current_user
from app.models.schemas import NotesRequest, NotesResponse

router = APIRouter()

@router.post("/generate", response_model=NotesResponse)
async def generate_notes(
    request: NotesRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate and save notes from documents"""
    from app.services.notes_service import NotesService
    
    service = NotesService()
    try:
        # We use create_note which persists it
        return await service.create_note(current_user["user_id"], request.document_ids, request.topic)
    except Exception as e:
        # Fallback if DB fails? Or just bubble up.
        raise e

@router.get("", response_model=list[NotesResponse])
async def get_notes(current_user: dict = Depends(get_current_user)):
    """Get all user notes"""
    from app.services.notes_service import NotesService
    service = NotesService()
    return await service.get_user_notes(current_user["user_id"])
