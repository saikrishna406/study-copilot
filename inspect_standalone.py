"""
Standalone script to inspect Supabase data without backend dependencies
"""
import os
import asyncio
from pathlib import Path

# Try to import supabase
try:
    from supabase import create_client
except ImportError:
    print("❌ supabase-py not installed. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "supabase"])
    from supabase import create_client

def load_env():
    env_path = Path("backend/.env")
    if not env_path.exists():
        print("❌ backend/.env not found")
        return {}
    
    config = {}
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                config[key] = val
    return config

async def inspect():
    print("🔍 Inspecting Supabase Data...")
    config = load_env()
    url = config.get("SUPABASE_URL")
    key = config.get("SUPABASE_SERVICE_KEY")
    
    if not url or not key:
        print("❌ Configuration missing")
        return

    # Use service key to bypass RLS
    supabase = create_client(url, key)
    
    # 1. Get latest document
    print("\n1️⃣ Checking latest document...")
    docs = supabase.table("documents").select("*").order("created_at", desc=True).limit(1).execute()
    
    if not docs.data:
        print("❌ No documents found")
        return
        
    doc = docs.data[0]
    print(f"   ID: {doc['id']}")
    print(f"   Name: {doc['title']}")
    print(f"   Status: {doc['status']}")
    print(f"   Pages: {doc.get('page_count')}")
    print(f"   Created: {doc['created_at']}")
    
    # 2. Check chunks
    print("\n2️⃣ Checking chunks...")
    chunks = supabase.table("document_chunks").select("id, content, embedding").eq("document_id", doc['id']).execute()
    
    count = len(chunks.data)
    print(f"   Total Chunks: {count}")
    
    if count == 0:
        print("❌ CRITICAL: No chunks found! PDF text extraction might have failed.")
        return
        
    # Check first chunk
    first_chunk = chunks.data[0]
    content = first_chunk.get('content', '')
    embedding = first_chunk.get('embedding', [])
    
    print(f"   First Chunk Content ({len(content)} chars): {content[:100]}...")
    
    if not embedding:
        print("❌ CRITICAL: First chunk has no embedding!")
    else:
        print(f"   First Chunk Embedding Length: {len(embedding)}")
        
    # 3. Test Vector Search
    print("\n3️⃣ Testing Vector Search (RPC)...")
    if embedding:
        try:
            # We use the document's own embedding to search for it
            # Matches should be near 1.0 similarity
            res = supabase.rpc(
                'match_document_chunks',
                {
                    'query_embedding': embedding,
                    'match_threshold': 0.1,  # Very low threshold
                    'match_count': 5,
                    'document_ids': [doc['id']]
                }
            ).execute()
            
            print(f"   RPC Call Result: Found {len(res.data)} chunks")
            for m in res.data:
                print(f"   - Match: {m['content'][:30]}... | Similarity: {m['similarity']}")
                
        except Exception as e:
            print(f"❌ RPC Call Failed: {e}")
            if "function" in str(e) and "does not exist" in str(e):
                 print("   -> The match_document_chunks function is MISSING from the database.")

if __name__ == "__main__":
    asyncio.run(inspect())
