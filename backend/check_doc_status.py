"""
Check the status of the uploaded document
"""
from app.core.auth import get_supabase_client
import sys

DOC_ID = "f9cd8940-97e9-4c0b-9fd9-0a4d102ab6f7"

print(f"Checking status for document: {DOC_ID}")

try:
    supabase = get_supabase_client()
    
    # Get document details
    res = supabase.table("documents").select("*").eq("id", DOC_ID).execute()
    
    if res.data:
        doc = res.data[0]
        print(f"Status: {doc.get('status')}")
        print(f"Title: {doc.get('title')}")
        print(f"Summary: {doc.get('summary') if doc.get('summary') else 'None'}")
        
        # Check if chunks exist (meaning processing ran)
        chunks_res = supabase.table("document_chunks").select("count").eq("document_id", DOC_ID).execute()
        # count is usually in head or separate, let's just select id limit 1
        chunks_res = supabase.table("document_chunks").select("id").eq("document_id", DOC_ID).limit(5).execute()
        print(f"Chunks found: {len(chunks_res.data)}")
        
    else:
        print("Document not found!")

except Exception as e:
    print(f"Error: {e}")
