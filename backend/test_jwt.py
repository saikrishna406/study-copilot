import jwt
import os
from dotenv import load_dotenv

load_dotenv()

# Get the JWT secret from .env
jwt_secret = os.getenv("SUPABASE_JWT_SECRET")

print(f"JWT Secret from .env: {jwt_secret[:20]}...")
print(f"JWT Secret length: {len(jwt_secret)}")

# Test token (you'll need to paste a real token from your browser)
test_token = input("\nPaste your JWT token from the browser (from localStorage or network tab): ").strip()

try:
    # Try to decode with HS256
    payload = jwt.decode(
        test_token,
        jwt_secret,
        algorithms=["HS256"],
        options={"verify_aud": False}
    )
    print("\n✅ JWT Validation SUCCESSFUL!")
    print(f"User ID: {payload.get('sub')}")
    print(f"Email: {payload.get('email')}")
except jwt.ExpiredSignatureError:
    print("\n❌ Token has expired")
except jwt.InvalidSignatureError:
    print("\n❌ Invalid signature - JWT secret is wrong")
except Exception as e:
    print(f"\n❌ Error: {e}")
