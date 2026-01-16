"""
Quiz Generation Service
"""
from openai import AsyncOpenAI
from app.core.config import settings
from app.core.auth import get_supabase_client
import json
import datetime
import uuid

class QuizService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL
        self.supabase = get_supabase_client()

    async def generate_quiz(self, document_id: str, num_questions: int = 5, difficulty: str = "medium") -> dict:
        """Generate quiz from document"""
        
        # Get chunks (context)
        chunks = self.supabase.table("document_chunks")\
            .select("content")\
            .eq("document_id", document_id)\
            .order("chunk_index")\
            .limit(8)\
            .execute()
            
        context = "\n".join([c['content'] for c in chunks.data])
        
        prompt = f"""Generate a quiz with {num_questions} multiple choice questions.
        Difficulty: {difficulty}
        
        Output purely JSON in the following format (no markdown code blocks):
        {{
            "questions": [
                {{
                    "question": "Question text here",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": 0,
                    "explanation": "Why this is correct"
                }}
            ]
        }}
        
        Content:
        {context[:15000]}
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a quiz generator. Output valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            response_format={"type": "json_object"}
        )
        
        content = response.choices[0].message.content
        data = json.loads(content)
        
        return {
            "id": str(uuid.uuid4()),
            "questions": data.get("questions", []),
            "created_at": datetime.datetime.now().isoformat()
        }
