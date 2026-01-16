"""
Test OpenAI API Key for PDF Analysis
This script specifically tests if the OpenAI API key can handle PDF-related tasks
"""
import asyncio
import os
from pathlib import Path

# Color codes for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_header(text):
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}{text}{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")

def print_success(text):
    print(f"{GREEN}✅ {text}{RESET}")

def print_error(text):
    print(f"{RED}❌ {text}{RESET}")

def print_warning(text):
    print(f"{YELLOW}⚠️  {text}{RESET}")

def print_info(text):
    print(f"   {text}")

async def test_openai_api_key():
    """Test OpenAI API key configuration and functionality"""
    print_header("1. Testing OpenAI API Key Configuration")
    
    try:
        # Try to load from backend config
        import sys
        sys.path.insert(0, str(Path(__file__).parent / "backend"))
        
        from app.core.config import settings
        
        if not settings.OPENAI_API_KEY:
            print_error("OpenAI API Key is not configured in settings")
            return False
        
        api_key = settings.OPENAI_API_KEY
        print_success(f"OpenAI API Key found (length: {len(api_key)} characters)")
        
        # Check if it starts with expected prefix
        if api_key.startswith('sk-'):
            print_success("API Key has correct format (starts with 'sk-')")
        else:
            print_warning("API Key doesn't start with 'sk-' - this might be incorrect")
        
        print_info(f"First 10 chars: {api_key[:10]}...")
        print_info(f"Last 4 chars: ...{api_key[-4:]}")
        
        return api_key
        
    except Exception as e:
        print_error(f"Failed to load configuration: {str(e)}")
        return False

async def test_basic_openai_connection(api_key):
    """Test basic OpenAI API connection"""
    print_header("2. Testing Basic OpenAI API Connection")
    
    try:
        from openai import AsyncOpenAI
        
        client = AsyncOpenAI(api_key=api_key)
        print_success("OpenAI client initialized")
        
        # Test with a simple query
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": "Reply with just 'OK' if you can read this."}
            ],
            max_tokens=10
        )
        
        result = response.choices[0].message.content
        print_success(f"API Response: {result}")
        print_info(f"Tokens used: {response.usage.total_tokens}")
        print_info(f"Model: {response.model}")
        
        return True
        
    except Exception as e:
        print_error(f"OpenAI API connection failed: {str(e)}")
        print_info("Common issues:")
        print_info("  - Invalid API key")
        print_info("  - API key has no credits/quota")
        print_info("  - Network connectivity issues")
        print_info("  - API key permissions")
        return False

async def test_pdf_analysis_capability(api_key):
    """Test OpenAI's ability to analyze PDF-like content"""
    print_header("3. Testing PDF Analysis Capability")
    
    try:
        from openai import AsyncOpenAI
        
        client = AsyncOpenAI(api_key=api_key)
        
        # Simulate PDF content analysis
        sample_pdf_text = """
        Chapter 1: Introduction to Machine Learning
        
        Machine learning is a subset of artificial intelligence that focuses on 
        building systems that can learn from data. The main types of machine learning are:
        
        1. Supervised Learning - Learning from labeled data
        2. Unsupervised Learning - Finding patterns in unlabeled data
        3. Reinforcement Learning - Learning through trial and error
        
        Key Concepts:
        - Training Data: The dataset used to train the model
        - Features: Input variables used for prediction
        - Labels: Output variables we want to predict
        """
        
        print_info("Testing with sample PDF-like content...")
        
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that analyzes document content and answers questions about it."
                },
                {
                    "role": "user",
                    "content": f"Here is content from a document:\n\n{sample_pdf_text}\n\nQuestion: What are the three main types of machine learning mentioned?"
                }
            ],
            max_tokens=200
        )
        
        answer = response.choices[0].message.content
        print_success("PDF content analysis successful!")
        print_info(f"Response: {answer[:200]}...")
        print_info(f"Tokens used: {response.usage.total_tokens}")
        
        # Check if the response contains expected keywords
        expected_keywords = ["supervised", "unsupervised", "reinforcement"]
        found_keywords = [kw for kw in expected_keywords if kw.lower() in answer.lower()]
        
        if len(found_keywords) >= 2:
            print_success(f"Response quality check passed (found {len(found_keywords)}/3 expected concepts)")
        else:
            print_warning("Response may not be accurate")
        
        return True
        
    except Exception as e:
        print_error(f"PDF analysis test failed: {str(e)}")
        return False

async def test_embedding_generation(api_key):
    """Test embedding generation for PDF chunks"""
    print_header("4. Testing Embedding Generation (for RAG)")
    
    try:
        from openai import AsyncOpenAI
        
        client = AsyncOpenAI(api_key=api_key)
        
        test_text = "This is a sample text chunk from a PDF document that needs to be embedded for semantic search."
        
        print_info("Generating embedding for sample text...")
        
        response = await client.embeddings.create(
            model="text-embedding-3-small",
            input=test_text
        )
        
        embedding = response.data[0].embedding
        
        print_success(f"Embedding generated successfully!")
        print_info(f"Embedding dimension: {len(embedding)}")
        print_info(f"First 5 values: {embedding[:5]}")
        print_info(f"Tokens used: {response.usage.total_tokens}")
        
        return True
        
    except Exception as e:
        print_error(f"Embedding generation failed: {str(e)}")
        print_info("This is critical for PDF search functionality!")
        return False

async def test_model_availability(api_key):
    """Test if the configured models are available"""
    print_header("5. Testing Model Availability")
    
    try:
        from openai import AsyncOpenAI
        from app.core.config import settings
        
        client = AsyncOpenAI(api_key=api_key)
        
        # Test chat model
        print_info(f"Testing chat model: {settings.OPENAI_MODEL}")
        try:
            response = await client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[{"role": "user", "content": "Hi"}],
                max_tokens=5
            )
            print_success(f"Chat model '{settings.OPENAI_MODEL}' is available")
        except Exception as e:
            print_error(f"Chat model '{settings.OPENAI_MODEL}' failed: {str(e)}")
            print_warning("Falling back to gpt-3.5-turbo might be needed")
        
        # Test embedding model
        print_info(f"Testing embedding model: {settings.OPENAI_EMBEDDING_MODEL}")
        try:
            response = await client.embeddings.create(
                model=settings.OPENAI_EMBEDDING_MODEL,
                input="test"
            )
            print_success(f"Embedding model '{settings.OPENAI_EMBEDDING_MODEL}' is available")
        except Exception as e:
            print_error(f"Embedding model '{settings.OPENAI_EMBEDDING_MODEL}' failed: {str(e)}")
        
        return True
        
    except Exception as e:
        print_error(f"Model availability test failed: {str(e)}")
        return False

async def main():
    """Run all tests"""
    print(f"\n{BLUE}{'='*60}")
    print("🔍 OpenAI API Key - PDF Analysis Test Suite")
    print(f"{'='*60}{RESET}\n")
    
    results = {
        "passed": 0,
        "failed": 0
    }
    
    # Test 1: API Key Configuration
    api_key = await test_openai_api_key()
    if not api_key:
        print_error("\n❌ Cannot proceed without valid API key configuration")
        return
    results["passed"] += 1
    
    # Test 2: Basic Connection
    if await test_basic_openai_connection(api_key):
        results["passed"] += 1
    else:
        results["failed"] += 1
        print_error("\n❌ Basic connection failed - this is a critical issue!")
        print_info("Please check:")
        print_info("  1. Is the API key correct?")
        print_info("  2. Does the API key have credits?")
        print_info("  3. Is there network connectivity?")
        return
    
    # Test 3: PDF Analysis
    if await test_pdf_analysis_capability(api_key):
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 4: Embedding Generation
    if await test_embedding_generation(api_key):
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Test 5: Model Availability
    if await test_model_availability(api_key):
        results["passed"] += 1
    else:
        results["failed"] += 1
    
    # Final Summary
    print_header("📊 Test Summary")
    print_success(f"Passed: {results['passed']}")
    print_error(f"Failed: {results['failed']}")
    
    total = results['passed'] + results['failed']
    success_rate = (results['passed'] / total * 100) if total > 0 else 0
    
    print(f"\n{BLUE}Success Rate: {success_rate:.1f}%{RESET}\n")
    
    if success_rate == 100:
        print(f"{GREEN}🎉 All tests passed! Your OpenAI API key is working perfectly for PDF analysis!{RESET}\n")
    elif success_rate >= 80:
        print(f"{YELLOW}⚠️  Most tests passed, but there are some issues to address{RESET}\n")
    else:
        print(f"{RED}❌ Critical issues detected with OpenAI API configuration{RESET}\n")
        print_info("Common solutions:")
        print_info("  1. Verify your API key at: https://platform.openai.com/api-keys")
        print_info("  2. Check your billing/credits at: https://platform.openai.com/account/billing")
        print_info("  3. Ensure the API key has proper permissions")
        print_info("  4. Try generating a new API key")

if __name__ == "__main__":
    asyncio.run(main())
