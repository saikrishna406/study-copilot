"""
Create a test user to fix Foreign Key issues
"""
from app.core.auth import get_supabase_client
import time

print("="*60)
print("🛠️ Setting up Test User")
print("="*60)

supabase = get_supabase_client()
TEST_EMAIL = "test@example.com"
TEST_PASS = "password123"

try:
    # 1. Try to create user
    print(f"\n1️⃣ Creating auth user: {TEST_EMAIL}")
    try:
        user = supabase.auth.admin.create_user({
            "email": TEST_EMAIL,
            "password": TEST_PASS,
            "email_confirm": True
        })
        user_id = user.user.id
        print(f"   ✅ User created! ID: {user_id}")
    except Exception as e:
        error_msg = str(e)
        if "already registered" in error_msg or "already exists" in error_msg:
            # Fetch existing user if creation failed
            print("   ℹ️  User already exists, fetching ID...")
            users = supabase.auth.admin.list_users()
            for u in users:
                if u.email == TEST_EMAIL:
                    user_id = u.id
                    print(f"   ✅ Found existing ID: {user_id}")
                    break
        else:
            print(f"   ❌ Creation failed: {e}")
            raise e

    # 2. Check public.users (if it exists)
    print("\n2️⃣ Checking public.users synchronization...")
    try:
        # Give trigger a moment if it exists
        time.sleep(2)
        
        # Check if user exists in public table
        res = supabase.table("users").select("*").eq("id", user_id).execute()
        if res.data:
            print("   ✅ User found in public.users table")
        else:
            print("   ⚠️  User NOT found in public.users table")
            print("   Attempting manual insert into public.users...")
            try:
                # Try to insert manually just in case
                supabase.table("users").insert({
                    "id": user_id,
                    "email": TEST_EMAIL,
                    "full_name": "Test User"
                }).execute()
                print("   ✅ Manually inserted into public.users")
            except Exception as insert_err:
                print(f"   ⚠️  Manual insert failed (maybe schema differs): {insert_err}")
                
    except Exception as e:
        print(f"   ℹ️  Could not check/insert public.users: {e}")
        
    print("\n" + "="*60)
    print(f"🎯 SOLUTION: Update auth.py with this ID:")
    print(f'   "user_id": "{user_id}"')
    print("="*60)

except Exception as e:
    print(f"\n❌ Critical Error: {e}")
    import traceback
    traceback.print_exc()
