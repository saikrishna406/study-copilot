"""
OpenAI summary service
"""
from openai import AsyncOpenAI
from app.core.config import settings

class SummaryService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = settings.OPENAI_MODEL
    
    async def generate_summary(self, text: str) -> str:
        """Generate summary for text"""
        
        # Truncate text if too long (simple limit to avoid token limits)
        # Assuming ~4 chars per token, 4000 tokens ~ 16000 chars.
        # Safe limit 10000 chars for context
        safe_text = text[:15000]
        
        prompt = f"""Please provide a comprehensive summary of the following document. 
        Focus on the main concepts, key arguments, and important details.
        
        Document Content:
        {safe_text}
        """
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a helpful study assistant that creates concise and accurate summaries."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5
        )
        
        return response.choices[0].message.content
