"""
Test direct upload to documents bucket
"""
from app.core.auth import get_supabase_client
import io

print("="*60)
print("Testing Direct Upload to 'documents' Bucket")
print("="*60)

try:
    supabase = get_supabase_client()
    
    # Create a tiny test file
    test_content = b"Test file content"
    test_path = "test/upload_test.txt"
    
    print(f"\n📤 Attempting upload to: {test_path}")
    
    # Try to upload
    result = supabase.storage.from_("documents").upload(
        test_path,
        test_content,
        {"content-type": "text/plain"}
    )
    
    print("✅ Upload SUCCESSFUL!")
    print(f"   Result: {result}")
    print("\n🎉 The 'documents' bucket exists and is working!")
    
    # Clean up
    print("\n🧹 Cleaning up test file...")
    supabase.storage.from_("documents").remove([test_path])
    print("   ✅ Test file removed")
    
except Exception as e:
    error_msg = str(e)
    print(f"❌ Upload FAILED!")
    print(f"   Error: {error_msg}")
    
    if "Bucket not found" in error_msg:
        print("\n💡 The bucket doesn't exist or isn't accessible.")
        print("   Please verify in Supabase dashboard:")
        print("   1. Go to Storage")
        print("   2. Check if 'documents' bucket exists")
        print("   3. If not, create it (name must be exactly 'documents')")
    elif "not allowed" in error_msg or "permission" in error_msg.lower():
        print("\n💡 Permission issue detected.")
        print("   Check your SUPABASE_SERVICE_KEY in .env file")
    
    import traceback
    traceback.print_exc()

print("\n" + "="*60)
