"""
Detailed upload test with full error output
"""
import requests
import io
import json

# Create a minimal valid PDF
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

files = {'file': ('test.pdf', io.BytesIO(pdf_content), 'application/pdf')}

print("Testing upload WITHOUT authentication header...")
print("URL: http://127.0.0.1:8000/api/documents/upload")
print()

try:
    response = requests.post(
        "http://127.0.0.1:8000/api/documents/upload",
        files=files,
        timeout=10
    )

    print(f"Status Code: {response.status_code}")
    print(f"Status Text: {response.reason}")
    print()
    print("Response Body:")
    try:
        print(json.dumps(response.json(), indent=2))
    except:
        print(response.text)
    print()
    print("Response Headers:")
    for key, value in response.headers.items():
        print(f"  {key}: {value}")
        
except requests.exceptions.Timeout:
    print("❌ Request timed out - server might be hanging")
except Exception as e:
    print(f"❌ Error: {e}")
