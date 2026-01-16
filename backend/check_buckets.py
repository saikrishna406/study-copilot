"""
Check if documents bucket exists and list all buckets
"""
from app.core.auth import get_supabase_client

print("="*60)
print("Checking Supabase Storage Buckets")
print("="*60)

try:
    supabase = get_supabase_client()
    
    print("\n📦 Listing all buckets...")
    buckets = supabase.storage.list_buckets()
    
    if not buckets:
        print("   ❌ No buckets found!")
        print("\n   Please create the 'documents' bucket in Supabase dashboard:")
        print("   1. Go to Storage in Supabase")
        print("   2. Click 'New bucket'")
        print("   3. Name: documents")
        print("   4. Keep it private")
    else:
        print(f"   Found {len(buckets)} bucket(s):")
        for bucket in buckets:
            print(f"   - {bucket.name} (public: {bucket.public})")
        
        bucket_names = [b.name for b in buckets]
        if "documents" in bucket_names:
            print("\n   ✅ 'documents' bucket EXISTS!")
        else:
            print("\n   ❌ 'documents' bucket NOT FOUND")
            print(f"   Available buckets: {bucket_names}")
            
except Exception as e:
    print(f"\n❌ Error checking buckets: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "="*60)
