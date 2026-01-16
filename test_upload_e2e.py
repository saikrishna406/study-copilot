"""
Complete end-to-end upload test
"""
import requests
import io

# Create a simple test PDF
pdf_content = b"""%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj
xref
0 4
0000000000 65535 f
0000000009 00000 n
0000000052 00000 n
0000000101 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
160
%%EOF"""

print("="*60)
print("END-TO-END UPLOAD TEST")
print("="*60)
print("\n📤 Uploading test PDF to backend...")
print("   URL: http://127.0.0.1:8000/api/documents/upload")
print("   Auth: None (DEV_MODE enabled)")
print()

files = {'file': ('test_document.pdf', io.BytesIO(pdf_content), 'application/pdf')}

try:
    response = requests.post(
        "http://127.0.0.1:8000/api/documents/upload",
        files=files,
        timeout=30
    )
    
    print(f"📊 Response Status: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ SUCCESS! Upload worked!")
        data = response.json()
        print(f"\n📄 Document Created:")
        print(f"   ID: {data.get('id')}")
        print(f"   Title: {data.get('title')}")
        print(f"   Status: {data.get('status')}")
        print(f"   File Path: {data.get('file_path')}")
    elif response.status_code == 401:
        print("❌ FAILED: 401 Unauthorized")
        print("   DEV_MODE might not be working")
        print(f"   Response: {response.json()}")
    elif response.status_code == 422:
        print("❌ FAILED: 422 Validation Error")
        print(f"   Response: {response.json()}")
    else:
        print(f"⚠️  Unexpected Status: {response.status_code}")
        try:
            print(f"   Response: {response.json()}")
        except:
            print(f"   Response: {response.text}")
            
except requests.exceptions.Timeout:
    print("❌ Request timed out (30s)")
    print("   Server might be processing or database issue")
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "="*60)
