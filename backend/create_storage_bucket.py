"""
Create the 'documents' storage bucket in Supabase
"""
from app.core.auth import get_supabase_client

print("="*60)
print("Creating Supabase Storage Bucket")
print("="*60)

supabase = get_supabase_client()

try:
    # Check if bucket exists
    print("\n1️⃣ Checking existing buckets...")
    buckets = supabase.storage.list_buckets()
    bucket_names = [b.name for b in buckets]
    print(f"   Existing buckets: {bucket_names}")
    
    if "documents" in bucket_names:
        print("   ✅ 'documents' bucket already exists!")
    else:
        print("\n2️⃣ Creating 'documents' bucket...")
        # Create the bucket
        supabase.storage.create_bucket(
            "documents",
            options={
                "public": False,  # Private bucket
                "file_size_limit": 10485760,  # 10MB
                "allowed_mime_types": ["application/pdf"]
            }
        )
        print("   ✅ 'documents' bucket created successfully!")
    
    print("\n3️⃣ Verifying bucket...")
    buckets = supabase.storage.list_buckets()
    bucket_names = [b.name for b in buckets]
    
    if "documents" in bucket_names:
        print("   ✅ Verification successful!")
        print(f"   All buckets: {bucket_names}")
    else:
        print("   ❌ Bucket not found after creation")
    
    print("\n" + "="*60)
    print("✅ Setup complete! Try uploading now.")
    print("="*60)
    
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
    print("\nYou may need to create the bucket manually in Supabase dashboard:")
    print("1. Go to your Supabase project")
    print("2. Navigate to Storage")
    print("3. Create a new bucket named 'documents'")
    print("4. Set it as private")
    import traceback
    traceback.print_exc()
