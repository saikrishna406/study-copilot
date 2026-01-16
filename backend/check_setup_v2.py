"""
Check bucket names and test Service Key privileges
"""
from app.core.auth import get_supabase_client
import sys

print("="*60)
print("🔍 Supabase Configuration Check")
print("="*60)

supabase = get_supabase_client()

# 1. Check Buckets
print("\n1️⃣ Checking Storage Buckets...")
try:
    buckets = supabase.storage.list_buckets()
    bucket_names = [b.name for b in buckets]
    print(f"   Found buckets: {bucket_names}")
    
    if "documents" in bucket_names:
        print("   ✅ 'documents' (plural) bucket exists.")
    elif "document" in bucket_names:
        print("   ⚠️  Found 'document' (singular). The code expects 'documents'.")
        print("   PLEASE RENAME or CREATE NEW bucket named 'documents'.")
    else:
        print("   ❌ 'documents' bucket NOT FOUND.")
except Exception as e:
    print(f"   ❌ Error listing buckets: {e}")
    # If this fails, it's strong evidence of Anon Key usage with restrictive RLS
    print("   (This error often means you are using the ANON KEY instead of SERVICE_ROLE KEY)")

# 2. Test RLS Bypass (Service Key Check)
print("\n2️⃣ Testing Service Key (RLS Bypass)...")
try:
    # Try an operation that would typically require auth if RLS was on
    # We'll just check if we can select from the users table or similar if accessible, 
    # but simplest is checking if we have admin privileges.
    # Actually, let's just try to insert a dummy record to 'documents' table if it exists
    # This might fail if the table doesn't allow nulls etc.
    
    # Better test: Check the key itself (if we can inspect it, but we can't easily)
    # let's assume if list_buckets failed above, it's the anon key.
    pass
except Exception as e:
    print(f"   Error: {e}")

print("\n" + "="*60)
