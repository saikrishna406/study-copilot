"""
Test upload endpoint with DEV_MODE
"""
import requests

print("Testing upload endpoint without authentication...")
print("="*60)

# Test health endpoint first
health_response = requests.get("http://127.0.0.1:8000/health")
print(f"✅ Health check: {health_response.status_code} - {health_response.json()}")

# Test upload endpoint without auth (should work in DEV_MODE)
print("\n🧪 Testing upload endpoint without authentication...")
print("   This should work because DEV_MODE=true")

# Create a dummy PDF file for testing
test_pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000214 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n308\n%%EOF"

files = {'file': ('test.pdf', test_pdf_content, 'application/pdf')}

try:
    # Try without Authorization header
    response = requests.post(
        "http://127.0.0.1:8000/api/documents/upload",
        files=files
    )
    
    print(f"\n📊 Response Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ SUCCESS! Upload works without authentication!")
        print(f"   Response: {response.json()}")
    elif response.status_code == 401:
        print("❌ FAILED! Still getting 401 Unauthorized")
        print("   DEV_MODE might not be enabled properly")
        print(f"   Response: {response.text}")
    else:
        print(f"⚠️  Unexpected status: {response.status_code}")
        print(f"   Response: {response.text}")
        
except Exception as e:
    print(f"❌ Error: {str(e)}")

print("\n" + "="*60)
