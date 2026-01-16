"""
Simple test to check if DEV_MODE is working
"""
import requests

print("="*60)
print("🧪 Testing DEV_MODE Authentication Bypass")
print("="*60)

# Test 1: Health check
print("\n1️⃣ Health Check")
response = requests.get("http://127.0.0.1:8000/health")
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")

# Test 2: Try to access a protected endpoint without auth
print("\n2️⃣ Testing Protected Endpoint (GET /api/documents)")
print("   This requires authentication normally...")

response = requests.get("http://127.0.0.1:8000/api/documents")
print(f"   Status: {response.status_code}")

if response.status_code == 200:
    print("   ✅ SUCCESS! DEV_MODE is working - no auth required!")
    print(f"   Response: {response.json()}")
elif response.status_code == 401:
    print("   ❌ FAILED! Still requires authentication")
    print(f"   Response: {response.json()}")
else:
    print(f"   ⚠️  Unexpected status: {response.status_code}")
    try:
        print(f"   Response: {response.json()}")
    except:
        print(f"   Response: {response.text}")

print("\n" + "="*60)
