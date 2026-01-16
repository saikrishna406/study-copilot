import requests
import io
import json

try:
    files = {'file': ('test.pdf', io.BytesIO(b"%PDF"), 'application/pdf')}
    r = requests.post("http://127.0.0.1:8000/api/documents/upload", files=files)
    print(f"STATUS:{r.status_code}")
    if r.status_code != 200:
        try:
            print(f"ERROR:{r.json()}")
        except:
            print(f"RAW:{r.text}")
    else:
        print("SUCCESS")
except Exception as e:
    print(f"EXCEPTION:{e}")
