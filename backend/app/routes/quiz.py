"""
Quiz generation routes (placeholder for Phase 3)
"""
from fastapi import APIRouter, Depends
from app.core.auth import get_current_user
from app.models.schemas import QuizRequest, QuizResponse

router = APIRouter()

@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(
    request: QuizRequest,
    current_user: dict = Depends(get_current_user)
):
    """Generate quiz from documents"""
    from app.services.quiz_service import QuizService
    
    service = QuizService()
    doc_id = request.document_ids[0]
    
    result = await service.generate_quiz(
        doc_id, 
        request.num_questions, 
        request.difficulty
    )
    
    return result
