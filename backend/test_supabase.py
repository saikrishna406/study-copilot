"""
Test Supabase connection
"""
from app.core.auth import get_supabase_client

print("="*60)
print("Testing Supabase Connection")
print("="*60)

try:
    supabase = get_supabase_client()
    print("✅ Supabase client created successfully")
    
    # Try to query documents table
    print("\nTesting database query...")
    result = supabase.table("documents").select("id").limit(1).execute()
    print(f"✅ Database query successful")
    print(f"   Result: {result.data}")
    
    # Try to check storage
    print("\nTesting storage access...")
    try:
        buckets = supabase.storage.list_buckets()
        print(f"✅ Storage accessible")
        print(f"   Buckets: {[b.name for b in buckets]}")
    except Exception as e:
        print(f"⚠️  Storage check: {str(e)[:100]}")
    
except Exception as e:
    print(f"❌ Supabase connection failed!")
    print(f"   Error: {str(e)}")
    import traceback
    traceback.print_exc()

print("="*60)
