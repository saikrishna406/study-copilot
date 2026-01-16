"""
Create a test user to fix Foreign Key issues - No special chars
"""
from app.core.auth import get_supabase_client
import sys

print("Setting up Test User...")

try:
    supabase = get_supabase_client()
    TEST_EMAIL = "test@example.com"
    TEST_PASS = "password123"

    print(f"Creating auth user: {TEST_EMAIL}")
    try:
        user = supabase.auth.admin.create_user({
            "email": TEST_EMAIL,
            "password": TEST_PASS,
            "email_confirm": True
        })
        user_id = user.user.id
        print(f"User created! ID: {user_id}")
    except Exception as e:
        error_msg = str(e)
        if "already registered" in error_msg or "already exists" in error_msg:
            print("User already exists, fetching ID...")
            users = supabase.auth.admin.list_users()
            found = False
            for u in users:
                if u.email == TEST_EMAIL:
                    user_id = u.id
                    print(f"Found existing ID: {user_id}")
                    found = True
                    break
            if not found:
                print("Could not find user even though error said exists.")
                raise e
        else:
            print(f"Creation failed: {e}")
            raise e

    print(f"SUCCESS_ID:{user_id}")

except Exception as e:
    print(f"Error: {e}")
