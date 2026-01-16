
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.core.auth import get_supabase_client
from app.models.schemas import NotebookCreate, NotebookUpdate

class NotebookService:
    def __init__(self):
        self.supabase = get_supabase_client()

    async def create_notebook(self, user_id: str, notebook_data: NotebookCreate) -> Dict[str, Any]:
        data = {
            "user_id": user_id,
            "title": notebook_data.title,
            "document_ids": notebook_data.document_ids or []
        }
        
        result = self.supabase.table("notebooks").insert(data).execute()
        if not result.data:
            raise Exception("Failed to create notebook")
            
        return result.data[0]

    async def get_user_notebooks(self, user_id: str) -> List[Dict[str, Any]]:
        result = self.supabase.table("notebooks")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("updated_at", desc=True)\
            .execute()
        return result.data

    async def get_notebook(self, notebook_id: str, user_id: str) -> Dict[str, Any]:
        result = self.supabase.table("notebooks")\
            .select("*")\
            .eq("id", notebook_id)\
            .eq("user_id", user_id)\
            .single()\
            .execute()
            
        if not result.data:
            raise Exception("Notebook not found")
        return result.data

    async def update_notebook(self, notebook_id: str, user_id: str, updates: NotebookUpdate) -> Dict[str, Any]:
        data = {}
        if updates.title is not None:
            data["title"] = updates.title
        if updates.document_ids is not None:
            data["document_ids"] = updates.document_ids
            
        if not data:
            return await self.get_notebook(notebook_id, user_id)
            
        result = self.supabase.table("notebooks")\
            .update(data)\
            .eq("id", notebook_id)\
            .eq("user_id", user_id)\
            .execute()
            
        if not result.data:
            raise Exception("Failed to update notebook")
        return result.data[0]

    async def delete_notebook(self, notebook_id: str, user_id: str):
        result = self.supabase.table("notebooks")\
            .delete()\
            .eq("id", notebook_id)\
            .eq("user_id", user_id)\
            .execute()
        return {"success": True}
