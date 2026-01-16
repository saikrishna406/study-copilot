"""
Quick Server Health Check Script
Tests if backend server can start and responds to requests
"""
import subprocess
import time
import requests
import sys
from pathlib import Path

print("="*60)
print("🏥 SERVER HEALTH CHECK")
print("="*60)

# Check if uvicorn is available
print("\n📋 Checking prerequisites...")
try:
    result = subprocess.run(
        ["uvicorn", "--version"],
        capture_output=True,
        text=True,
        timeout=5
    )
    if result.returncode == 0:
        print(f"✅ Uvicorn installed: {result.stdout.strip()}")
    else:
        print("❌ Uvicorn not found - install with: pip install uvicorn")
        sys.exit(1)
except Exception as e:
    print(f"❌ Error checking uvicorn: {str(e)}")
    sys.exit(1)

# Start server in background
print("\n🚀 Starting backend server...")
print("   Command: uvicorn app.main:app --host 127.0.0.1 --port 8000")

try:
    server_process = subprocess.Popen(
        ["uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=Path(__file__).parent / "backend",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    print("   Waiting for server to start...")
    time.sleep(5)  # Give server time to start
    
    # Check if process is still running
    if server_process.poll() is not None:
        stdout, stderr = server_process.communicate()
        print(f"❌ Server failed to start")
        print(f"   Error: {stderr[:200]}")
        sys.exit(1)
    
    print("✅ Server process started")
    
    # Test endpoints
    print("\n🧪 Testing endpoints...")
    base_url = "http://127.0.0.1:8000"
    
    endpoints = [
        ("/", "Root endpoint"),
        ("/health", "Health check"),
        ("/docs", "API documentation")
    ]
    
    all_passed = True
    for endpoint, description in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            if response.status_code == 200:
                print(f"✅ {description}: {endpoint} - Status {response.status_code}")
            else:
                print(f"⚠️  {description}: {endpoint} - Status {response.status_code}")
        except Exception as e:
            print(f"❌ {description}: {endpoint} - Error: {str(e)[:50]}")
            all_passed = False
    
    # Test API routes structure
    print("\n📡 Checking API routes...")
    try:
        response = requests.get(f"{base_url}/docs", timeout=5)
        if response.status_code == 200:
            print("✅ API documentation accessible at /docs")
    except:
        print("⚠️  Could not access API documentation")
    
    print("\n" + "="*60)
    if all_passed:
        print("✅ SERVER HEALTH CHECK PASSED")
    else:
        print("⚠️  SERVER HEALTH CHECK COMPLETED WITH WARNINGS")
    print("="*60)
    
    print("\n📝 Server is running at: http://127.0.0.1:8000")
    print("📚 API docs available at: http://127.0.0.1:8000/docs")
    print("\n⚠️  Press Ctrl+C to stop the server")
    
    # Keep server running
    try:
        server_process.wait()
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping server...")
        server_process.terminate()
        server_process.wait()
        print("✅ Server stopped")
        
except KeyboardInterrupt:
    print("\n\n🛑 Stopping server...")
    if 'server_process' in locals():
        server_process.terminate()
        server_process.wait()
    print("✅ Server stopped")
except Exception as e:
    print(f"\n❌ Error during health check: {str(e)}")
    if 'server_process' in locals():
        server_process.terminate()
    sys.exit(1)
