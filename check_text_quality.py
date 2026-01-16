"""
Debug script to check the quality of extracted text
"""
import asyncio
import sys
from pathlib import Path
from app.core.auth import get_supabase_client

# Add backend to path
sys.path.append(str(Path.cwd() / "backend"))

async def check_extraction():
    print("🔍 Checking extracted text quality...")
    supabase = get_supabase_client()
    
    # 1. Get latest document
    docs = supabase.table("documents")\
        .select("*")\
        .order("created_at", desc=True)\
        .limit(1)\
        .execute()
        
    if not docs.data:
        print("❌ No documents found")
        return
        
    doc = docs.data[0]
    print(f"\n📄 Checking Document: {doc['title']} (ID: {doc['id']})")

    # 2. Get all chunks ordered by index
    chunks = supabase.table("document_chunks")\
        .select("chunk_index, content")\
        .eq("document_id", doc['id'])\
        .order("chunk_index")\
        .limit(10)\
        .execute()
        
    print(f"\n📝 Extracted Text Preview (First 10 chunks):")
    print("=" * 60)
    
    for chunk in chunks.data:
        print(f"\n--- Chunk {chunk['chunk_index']} ---")
        print(chunk['content'])
        print("-" * 20)

if __name__ == "__main__":
    asyncio.run(check_extraction())
