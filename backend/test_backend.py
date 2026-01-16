"""
Comprehensive Backend Testing Script
Tests all major backend functionality quickly
"""
import asyncio
import sys
from pathlib import Path

# Test results tracking
test_results = {
    "passed": [],
    "failed": [],
    "warnings": []
}

def print_test_header(test_name):
    print(f"\n{'='*60}")
    print(f"🧪 TEST: {test_name}")
    print(f"{'='*60}")

def print_result(success, message):
    if success:
        print(f"✅ {message}")
        test_results["passed"].append(message)
    else:
        print(f"❌ {message}")
        test_results["failed"].append(message)

def print_warning(message):
    print(f"⚠️  {message}")
    test_results["warnings"].append(message)

# Test 1: Configuration Loading
print_test_header("Configuration Loading")
try:
    from app.core.config import settings
    print_result(True, "Settings imported successfully")
    
    # Check critical settings
    if settings.OPENAI_API_KEY:
        print_result(True, f"OpenAI API Key configured (length: {len(settings.OPENAI_API_KEY)})")
    else:
        print_result(False, "OpenAI API Key not configured")
    
    if settings.SUPABASE_URL:
        print_result(True, f"Supabase URL configured: {settings.SUPABASE_URL[:30]}...")
    else:
        print_result(False, "Supabase URL not configured")
    
    if settings.SUPABASE_SERVICE_KEY:
        print_result(True, f"Supabase Service Key configured (length: {len(settings.SUPABASE_SERVICE_KEY)})")
    else:
        print_result(False, "Supabase Service Key not configured")
    
    print(f"   Model: {settings.OPENAI_MODEL}")
    print(f"   Embedding Model: {settings.OPENAI_EMBEDDING_MODEL}")
    print(f"   Chunk Size: {settings.CHUNK_SIZE}")
    
except Exception as e:
    print_result(False, f"Configuration loading failed: {str(e)}")

# Test 2: OpenAI Connection
print_test_header("OpenAI API Connection")
async def test_openai():
    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Say 'OK' if you can read this."}],
            max_tokens=10
        )
        
        print_result(True, f"OpenAI API responding: {response.choices[0].message.content}")
        print(f"   Tokens used: {response.usage.total_tokens}")
        return True
    except Exception as e:
        print_result(False, f"OpenAI connection failed: {str(e)}")
        return False

asyncio.run(test_openai())

# Test 3: Supabase Connection
print_test_header("Supabase Connection")
try:
    from app.core.auth import get_supabase_client
    supabase = get_supabase_client()
    print_result(True, "Supabase client initialized")
    
    # Try a simple query to test connection
    try:
        result = supabase.table("documents").select("id").limit(1).execute()
        print_result(True, "Supabase database connection successful")
    except Exception as e:
        print_warning(f"Supabase query test: {str(e)[:100]}")
        
except Exception as e:
    print_result(False, f"Supabase initialization failed: {str(e)}")

# Test 4: Embedding Service
print_test_header("Embedding Service")
async def test_embeddings():
    try:
        from app.services.embedding_service import EmbeddingService
        service = EmbeddingService()
        
        test_text = "This is a test document for embedding generation."
        embedding = await service.create_embedding(test_text)
        
        if embedding and len(embedding) > 0:
            print_result(True, f"Embedding generated successfully (dimension: {len(embedding)})")
            return True
        else:
            print_result(False, "Embedding generation returned empty result")
            return False
    except Exception as e:
        print_result(False, f"Embedding service failed: {str(e)}")
        return False

asyncio.run(test_embeddings())

# Test 5: FastAPI Application
print_test_header("FastAPI Application Structure")
try:
    from app.main import app
    print_result(True, "FastAPI app imported successfully")
    
    # Check routes
    routes = [route.path for route in app.routes]
    print(f"   Total routes: {len(routes)}")
    
    critical_routes = ["/api/chat/query", "/api/documents/upload", "/api/auth"]
    for route in critical_routes:
        if any(route in r for r in routes):
            print_result(True, f"Route exists: {route}")
        else:
            print_warning(f"Route not found: {route}")
    
except Exception as e:
    print_result(False, f"FastAPI app loading failed: {str(e)}")

# Test 6: File Structure
print_test_header("Project Structure")
try:
    required_dirs = [
        Path("app"),
        Path("app/routes"),
        Path("app/services"),
        Path("app/core"),
        Path("app/models")
    ]
    
    for dir_path in required_dirs:
        if dir_path.exists():
            print_result(True, f"Directory exists: {dir_path}")
        else:
            print_result(False, f"Directory missing: {dir_path}")
    
    required_files = [
        Path("app/main.py"),
        Path("app/routes/chat.py"),
        Path("app/routes/documents.py"),
        Path("app/services/embedding_service.py"),
        Path("requirements.txt")
    ]
    
    for file_path in required_files:
        if file_path.exists():
            print_result(True, f"File exists: {file_path}")
        else:
            print_result(False, f"File missing: {file_path}")
            
except Exception as e:
    print_result(False, f"Structure check failed: {str(e)}")

# Test 7: Dependencies
print_test_header("Python Dependencies")
try:
    import fastapi
    print_result(True, f"FastAPI installed: {fastapi.__version__}")
except:
    print_result(False, "FastAPI not installed")

try:
    import openai
    print_result(True, f"OpenAI SDK installed: {openai.__version__}")
except:
    print_result(False, "OpenAI SDK not installed")

try:
    import supabase
    print_result(True, "Supabase client installed")
except:
    print_result(False, "Supabase client not installed")

try:
    import pypdf
    print_result(True, "PyPDF installed")
except:
    print_warning("PyPDF not installed (needed for PDF processing)")

# Final Summary
print(f"\n{'='*60}")
print("📊 TEST SUMMARY")
print(f"{'='*60}")
print(f"✅ Passed: {len(test_results['passed'])}")
print(f"❌ Failed: {len(test_results['failed'])}")
print(f"⚠️  Warnings: {len(test_results['warnings'])}")

if test_results['failed']:
    print("\n❌ FAILED TESTS:")
    for failure in test_results['failed']:
        print(f"   - {failure}")

if test_results['warnings']:
    print("\n⚠️  WARNINGS:")
    for warning in test_results['warnings']:
        print(f"   - {warning}")

success_rate = (len(test_results['passed']) / 
               (len(test_results['passed']) + len(test_results['failed'])) * 100 
               if (len(test_results['passed']) + len(test_results['failed'])) > 0 else 0)

print(f"\n🎯 Success Rate: {success_rate:.1f}%")

if success_rate >= 80:
    print("🎉 Backend is in good shape!")
    sys.exit(0)
elif success_rate >= 60:
    print("⚠️  Backend has some issues that need attention")
    sys.exit(1)
else:
    print("❌ Backend has critical issues")
    sys.exit(1)
