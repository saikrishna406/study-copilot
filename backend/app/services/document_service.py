"""
Document upload and management service
"""
import os
import uuid
from typing import List
from fastapi import UploadFile, HTTPException
from app.core.config import settings
from app.core.auth import get_supabase_client

class DocumentService:
    def __init__(self):
        self.supabase = get_supabase_client()
    
    async def upload_document(self, file: UploadFile, user_id: str) -> dict:
        """Upload PDF to Supabase Storage and create database record"""
        
        # Validate file
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        # Read file
        contents = await file.read()
        file_size = len(contents)
        
        if file_size > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(status_code=400, detail="File too large")
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        file_path = f"{user_id}/{file_id}.pdf"
        
        try:
            # Upload to Supabase Storage
            self.supabase.storage.from_("documents").upload(
                file_path,
                contents,
                {"content-type": "application/pdf"}
            )
            
            # Create database record
            document_data = {
                "user_id": user_id,
                "title": file.filename,
                "file_path": file_path,
                "file_size": file_size,
                "status": "processing"
            }
            
            result = self.supabase.table("documents").insert(document_data).execute()
            
            return result.data[0]
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
    
    async def get_user_documents(self, user_id: str) -> List[dict]:
        """Get all documents for a user"""
        result = self.supabase.table("documents")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .execute()
        
        return result.data
    
    async def get_document(self, document_id: str, user_id: str) -> dict:
        """Get a specific document"""
        result = self.supabase.table("documents")\
            .select("*")\
            .eq("id", document_id)\
            .eq("user_id", user_id)\
            .single()\
            .execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Document not found")
        
        return result.data
    
    async def delete_document(self, document_id: str, user_id: str):
        """Delete a document"""
        # Get document to get file path
        document = await self.get_document(document_id, user_id)
        
        # Delete from storage
        self.supabase.storage.from_("documents").remove([document["file_path"]])
        
        # Delete from database (cascades to chunks)
        self.supabase.table("documents").delete().eq("id", document_id).execute()
        
        return {"message": "Document deleted successfully"}
