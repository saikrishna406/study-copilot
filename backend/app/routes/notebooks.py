
"""
Notebooks management routes
"""
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.core.auth import get_current_user
from app.models.schemas import NotebookCreate, NotebookUpdate, NotebookResponse
from app.services.notebook_service import NotebookService

router = APIRouter()

@router.post("", response_model=NotebookResponse)
async def create_notebook(
    notebook: NotebookCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new notebook workspace"""
    service = NotebookService()
    try:
        return await service.create_notebook(current_user["user_id"], notebook)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[NotebookResponse])
async def get_notebooks(current_user: dict = Depends(get_current_user)):
    """List all user notebooks"""
    service = NotebookService()
    return await service.get_user_notebooks(current_user["user_id"])

@router.get("/{notebook_id}", response_model=NotebookResponse)
async def get_notebook(
    notebook_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific notebook"""
    service = NotebookService()
    try:
        return await service.get_notebook(notebook_id, current_user["user_id"])
    except Exception as e:
        raise HTTPException(status_code=404, detail="Notebook not found")

@router.patch("/{notebook_id}", response_model=NotebookResponse)
async def update_notebook(
    notebook_id: str,
    updates: NotebookUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update notebook (title or documents)"""
    service = NotebookService()
    try:
        return await service.update_notebook(notebook_id, current_user["user_id"], updates)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{notebook_id}")
async def delete_notebook(
    notebook_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a notebook"""
    service = NotebookService()
    return await service.delete_notebook(notebook_id, current_user["user_id"])
