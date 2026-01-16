import requests
import json

# Test the chat endpoint
url = "http://localhost:8000/api/chat/query"
headers = {"Content-Type": "application/json"}
data = {
    "document_ids": ["f8f61f05-b8b6-43da-961c-d29628366b4b"],  # Your uploaded document
    "message": "What is this document about?"
}

print("Testing Chat endpoint...")
print(f"URL: {url}")
print(f"Payload: {json.dumps(data, indent=2)}")
print("\nSending request...\n")

try:
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
