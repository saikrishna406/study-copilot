"""
Check database tables and users
"""
from app.core.auth import get_supabase_client
import json

print("="*60)
print("🔍 Database User Check")
print("="*60)

supabase = get_supabase_client()

try:
    # 1. Check for existing users in auth.users (via admin api if possible, or just public wrapper)
    # Supabase-py client allows admin auth operations with service key
    print("\n1️⃣ Checking Auth Users...")
    try:
        users = supabase.auth.admin.list_users()
        print(f"   Found {len(users)} users.")
        for u in users:
            print(f"   - ID: {u.id} | Email: {u.email}")
            
        if users:
            print(f"\n💡 VALID ID TO USE: {users[0].id}")
    except Exception as e:
        print(f"   ⚠️  Could not list auth users: {e}")

    # 2. Check public tables
    print("\n2️⃣ Checking public tables...")
    try:
        # Try to select from 'users' if it exists
        res = supabase.table("users").select("*").limit(1).execute()
        print("   Table 'users' exists.")
    except Exception as e:
        print(f"   ⚠️  Table 'users' access failed: {e}")

except Exception as e:
    print(f"❌ Error: {e}")

print("="*60)
