"""
Inspect the latest uploaded document and its chunks
"""
import asyncio
import sys
from pathlib import Path
from app.core.auth import get_supabase_client

# Add backend to path
sys.path.append(str(Path.cwd() / "backend"))

async def inspect_latest_doc():
    print("🔍 Inspecting latest document...")
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
    print(f"\n📄 Document: {doc['title']}")
    print(f"   ID: {doc['id']}")
    print(f"   Status: {doc['status']}")
    print(f"   Page Count: {doc.get('page_count')}")
    print(f"   Summary: {doc.get('summary')[:50]}..." if doc.get('summary') else "   Summary: None")
    
    # 2. Get chunks count
    chunks_count = supabase.table("document_chunks")\
        .select("id", count="exact")\
        .eq("document_id", doc['id'])\
        .execute()
    
    count = chunks_count.count # Supabase-py specific
    print(f"\n🧩 Total Chunks: {count}")
    
    if count == 0:
        print("❌ CRITICAL: No chunks found for this document!")
        return

    # 3. Inspect first few chunks
    print("\n🔍 First 3 Chunks Content:")
    chunks = supabase.table("document_chunks")\
        .select("chunk_index, content, embedding")\
        .eq("document_id", doc['id'])\
        .order("chunk_index")\
        .limit(3)\
        .execute()
        
    for chunk in chunks.data:
        content_preview = chunk['content'][:100].replace('\n', ' ')
        has_embedding = "Yes" if chunk.get('embedding') else "No"
        embedding_len = len(chunk.get('embedding', [])) if chunk.get('embedding') else 0
        print(f"   [{chunk['chunk_index']}] Content: {content_preview}...")
        print(f"       Has Embedding: {has_embedding} (Len: {embedding_len})")
        
    # 4. Test Vector Search
    print("\n🧪 Testing Vector Search (RPC)...")
    if chunks.data and chunks.data[0].get('embedding'):
        # Use the first chunk's embedding to search for itself - should result in perfect match
        first_embedding = chunks.data[0]['embedding']
        try:
            res = supabase.rpc(
                'match_document_chunks',
                {
                    'query_embedding': first_embedding,
                    'match_threshold': 0.1, # Extremely low threshold to catch anything
                    'match_count': 5,
                    'document_ids': [doc['id']]
                }
            ).execute()
            
            print(f"   Querying with actual chunk embedding...")
            print(f"   Found {len(res.data)} matches")
            for m in res.data:
                print(f"     - Similarity: {m['similarity']:.4f} | Content: {m['content'][:50]}...")
        except Exception as e:
            print(f"❌ RPC Call Failed: {e}")

if __name__ == "__main__":
    asyncio.run(inspect_latest_doc())
