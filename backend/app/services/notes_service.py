"""
Notes Generation Service
"""
from openai import AsyncOpenAI
from app.core.config import settings
from app.core.auth import get_supabase_client
import datetime
import uuid

_openai_client = None

class NotesService:
    def __init__(self):
        global _openai_client
        if _openai_client is None:
            _openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.client = _openai_client
        self.model = settings.OPENAI_MODEL
        self.supabase = get_supabase_client()

    async def generate_notes(self, document_id: str, topic: str = None) -> dict:
        """Generate study notes from document"""
        
        # Get document chunks (context)
        # Fetch first 8 chunks (approx 8000 tokens context) for general notes
        # In a real app, we would use vector search if topic is provided
        chunks = self.supabase.table("document_chunks")\
            .select("content")\
            .eq("document_id", document_id)\
            .order("chunk_index")\
            .limit(8)\
            .execute()
            
        context = "\n".join([c['content'] for c in chunks.data])
        
        prompt = f"""Create detailed study notes based on the following document content.
        Use Markdown formatting (Headers, bullet points, bold text).
        Focus on key concepts, definitions, and important relationships.
        
        Topic Focus: {topic if topic else "General Overview"}
        
        Content:
        {context[:15000]}
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are an expert tutor creating study materials."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        
        # Persist note in Supabase
        user = self.supabase.auth.get_user()
        user_id = user.user.id if user else None 
        # Note: In a real service we get user_id passed in or from context. 
        # Here we rely on AuthMiddleware or passed arguments.
        # Actually generate_notes doesn't take user_id. We should pass it or handle it.
        # But wait, self.supabase is service role or anon? 
        # get_supabase_client() usually returns client with service key or anon key.
        # If we need RLS we need authenticated client. 
        # Current architecture passes user_id to route handlers.
        
        # Return dict for now, but to persist we need user_id. 
        # I'll update signature in next step or assume caller handles persistence?
        # No, service should handle it if it has access.
        # Let's return the content and handle persistence in route or update here.
        
        # BETTER APPROACH: Update method signature to accept user_id.
        return {
            "id": str(uuid.uuid4()),
            "content": content,
            "created_at": datetime.datetime.now().isoformat(),
            "title": f"Notes on {topic}" if topic else "Study Notes"
        }

    async def create_note(self, user_id: str, document_ids: list, topic: str) -> dict:
        """Generate and save note"""
        # 1. Generate content
        gen_result = await self.generate_notes(document_ids[0], topic)
        content = gen_result["content"]
        title = gen_result["title"]
        
        # 2. Save to DB
        data = {
            "user_id": user_id,
            "document_ids": document_ids,
            "title": title,
            "content": content
        }
        
        res = self.supabase.table("notes").insert(data).execute()
        return res.data[0]

    async def get_user_notes(self, user_id: str) -> list:
        """Get all notes for a user"""
        res = self.supabase.table("notes").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return res.data
