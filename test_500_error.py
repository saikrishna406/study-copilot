"""
Test upload to see the exact 500 error
"""
import requests
import io

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

print("Testing upload to see 500 error details...")
response = requests.post(
    "http://127.0.0.1:8000/api/documents/upload",
    files=files
)

print(f"Status: {response.status_code}")
print(f"Response: {response.text}")
