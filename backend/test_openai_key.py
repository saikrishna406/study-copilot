"""
Simple script to test if the OpenAI API key is working
"""
import asyncio
from openai import AsyncOpenAI
from app.core.config import settings

async def test_openai_key():
    """Test the OpenAI API key with a simple completion request"""
    try:
        print("Testing OpenAI API key...")
        print(f"Using model: {settings.OPENAI_MODEL}")
        
        # Initialize the client
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
        # Test with a simple completion
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",  # Using a cheaper model for testing
            messages=[
                {"role": "user", "content": "Say 'API key is working!' if you can read this."}
            ],
            max_tokens=50
        )
        
        print("\n✅ SUCCESS! OpenAI API key is working!")
        print(f"Response: {response.choices[0].message.content}")
        print(f"\nModel used: {response.model}")
        print(f"Tokens used: {response.usage.total_tokens}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR! OpenAI API key test failed!")
        print(f"Error type: {type(e).__name__}")
        print(f"Error message: {str(e)}")
        return False

if __name__ == "__main__":
    asyncio.run(test_openai_key())
