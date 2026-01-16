"""
Standalone script to check text quality and summary
"""
import os
import asyncio
from pathlib import Path
import sys

# Try to import supabase
try:
    from supabase import create_client
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "supabase"])
    from supabase import create_client

def load_env():
    env_path = Path("backend/.env")
    if not env_path.exists():
        return {}
    config = {}
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                config[key] = val
    return config

async def check_quality():
    config = load_env()
    supabase = create_client(config.get("SUPABASE_URL"), config.get("SUPABASE_SERVICE_KEY"))
    
    # Get latest doc
    res = supabase.table("documents").select("*").order("created_at", desc=True).limit(1).execute()
    if not res.data:
        print("❌ No docs found")
        return
        
    doc = res.data[0]
    print(f"\n📄 Document: {doc['title']}")
    
    # Check Summary
    summary = doc.get('summary')
    if summary:
        print(f"\n✅ SUMMARY EXISTS ({len(summary)} chars):")
        print(f"{summary[:300]}...")
    else:
        print("\n❌ NO SUMMARY FOUND! (Field is empty/null)")
        
    # Check Chunks
    chunks = supabase.table("document_chunks")\
        .select("content")\
        .eq("document_id", doc['id'])\
        .limit(3)\
        .execute()
        
    print(f"\n📝 First 3 Chunks:")
    for i, c in enumerate(chunks.data):
        print(f"[{i}] {c['content'][:100]}...")

if __name__ == "__main__":
    asyncio.run(check_quality())
