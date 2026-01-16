"""
Simple OpenAI API Key Test for PDF Analysis
Tests if the OpenAI API key can work for analyzing PDFs
"""
import asyncio
import os
from pathlib import Path

# Load environment variables from backend/.env
env_path = Path(__file__).parent / "backend" / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key] = value

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')

print("="*60)
print("🔍 OpenAI API Key Test for PDF Analysis")
print("="*60)

# Test 1: Check if API key exists
print("\n1️⃣ Checking API Key Configuration...")
if not OPENAI_API_KEY:
    print("❌ OPENAI_API_KEY not found in environment")
    print("   Please check backend/.env file")
    exit(1)

print(f"✅ API Key found (length: {len(OPENAI_API_KEY)} chars)")
print(f"   First 10 chars: {OPENAI_API_KEY[:10]}...")
print(f"   Last 4 chars: ...{OPENAI_API_KEY[-4:]}")

if OPENAI_API_KEY.startswith('sk-proj-') or OPENAI_API_KEY.startswith('sk-'):
    print("✅ API Key format looks correct")
else:
    print("⚠️  API Key format might be incorrect (should start with 'sk-')")

async def test_basic_connection():
    """Test basic OpenAI API connection"""
    print("\n2️⃣ Testing Basic API Connection...")
    try:
        from openai import AsyncOpenAI
        
        client = AsyncOpenAI(api_key=OPENAI_API_KEY)
        
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": "Reply with just 'OK' if you can read this."}
            ],
            max_tokens=10
        )
        
        result = response.choices[0].message.content
        print(f"✅ API Connection Successful!")
        print(f"   Response: {result}")
        print(f"   Tokens used: {response.usage.total_tokens}")
        return True
        
    except Exception as e:
        print(f"❌ API Connection Failed!")
        print(f"   Error: {str(e)}")
        
        # Provide helpful error messages
        error_str = str(e).lower()
        if "invalid" in error_str or "authentication" in error_str:
            print("\n💡 Possible issues:")
            print("   - API key is invalid or expired")
            print("   - API key format is incorrect")
            print("   - Try generating a new API key at: https://platform.openai.com/api-keys")
        elif "quota" in error_str or "billing" in error_str:
            print("\n💡 Possible issues:")
            print("   - No credits available on your OpenAI account")
            print("   - Check billing at: https://platform.openai.com/account/billing")
        elif "rate" in error_str:
            print("\n💡 Possible issues:")
            print("   - Rate limit exceeded")
            print("   - Wait a moment and try again")
        
        return False

async def test_pdf_analysis():
    """Test PDF content analysis capability"""
    print("\n3️⃣ Testing PDF Content Analysis...")
    try:
        from openai import AsyncOpenAI
        
        client = AsyncOpenAI(api_key=OPENAI_API_KEY)
        
        # Simulate PDF content
        sample_pdf_content = """
        Chapter 3: Photosynthesis
        
        Photosynthesis is the process by which plants convert light energy into chemical energy.
        The general equation for photosynthesis is:
        
        6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂
        
        Key components:
        - Chlorophyll: The green pigment that captures light
        - Chloroplasts: Organelles where photosynthesis occurs
        - Stomata: Pores for gas exchange
        """
        
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful study assistant that analyzes document content and answers questions."
                },
                {
                    "role": "user",
                    "content": f"Here is content from a PDF:\n\n{sample_pdf_content}\n\nQuestion: What is the main function of chlorophyll?"
                }
            ],
            max_tokens=100
        )
        
        answer = response.choices[0].message.content
        print(f"✅ PDF Analysis Working!")
        print(f"   Question: What is the main function of chlorophyll?")
        print(f"   Answer: {answer[:150]}...")
        print(f"   Tokens used: {response.usage.total_tokens}")
        
        # Check if answer is relevant
        if "light" in answer.lower() or "capture" in answer.lower() or "absorb" in answer.lower():
            print("✅ Answer quality check: PASSED (relevant answer)")
        else:
            print("⚠️  Answer quality check: Answer may not be accurate")
        
        return True
        
    except Exception as e:
        print(f"❌ PDF Analysis Failed!")
        print(f"   Error: {str(e)}")
        return False

async def test_embeddings():
    """Test embedding generation for RAG"""
    print("\n4️⃣ Testing Embedding Generation (for RAG/Search)...")
    try:
        from openai import AsyncOpenAI
        
        client = AsyncOpenAI(api_key=OPENAI_API_KEY)
        
        test_text = "Photosynthesis is the process by which plants make food using sunlight."
        
        response = await client.embeddings.create(
            model="text-embedding-3-small",
            input=test_text
        )
        
        embedding = response.data[0].embedding
        
        print(f"✅ Embedding Generation Working!")
        print(f"   Embedding dimension: {len(embedding)}")
        print(f"   Sample values: [{embedding[0]:.4f}, {embedding[1]:.4f}, {embedding[2]:.4f}, ...]")
        print(f"   Tokens used: {response.usage.total_tokens}")
        print("   ✅ This is critical for PDF search functionality!")
        
        return True
        
    except Exception as e:
        print(f"❌ Embedding Generation Failed!")
        print(f"   Error: {str(e)}")
        print("   ⚠️  Without embeddings, PDF search won't work!")
        return False

async def main():
    """Run all tests"""
    results = []
    
    # Test basic connection
    result1 = await test_basic_connection()
    results.append(result1)
    
    if not result1:
        print("\n" + "="*60)
        print("❌ CRITICAL: Basic connection failed!")
        print("   Cannot proceed with other tests.")
        print("   Please fix the API key issue first.")
        print("="*60)
        return
    
    # Test PDF analysis
    result2 = await test_pdf_analysis()
    results.append(result2)
    
    # Test embeddings
    result3 = await test_embeddings()
    results.append(result3)
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST SUMMARY")
    print("="*60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"✅ Passed: {passed}/{total}")
    print(f"❌ Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 SUCCESS! Your OpenAI API key is fully functional for PDF analysis!")
        print("\n✅ What this means:")
        print("   - Your API key is valid and has credits")
        print("   - PDF content can be analyzed")
        print("   - Embeddings can be generated for search")
        print("   - The chat feature should work with PDFs")
    elif passed >= 2:
        print("\n⚠️  PARTIAL SUCCESS: Most features work but there are some issues")
    else:
        print("\n❌ FAILED: Your OpenAI API key has critical issues")
        print("\n🔧 Recommended actions:")
        print("   1. Verify your API key at: https://platform.openai.com/api-keys")
        print("   2. Check billing/credits at: https://platform.openai.com/account/billing")
        print("   3. Try generating a new API key")
        print("   4. Make sure the key is correctly copied to backend/.env")

if __name__ == "__main__":
    asyncio.run(main())
