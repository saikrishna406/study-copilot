"""
Script to verify database schema and state
"""
import asyncio
import os
from pathlib import Path
from app.core.config import settings
from app.core.auth import get_supabase_client

# Colors
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
RESET = '\033[0m'

async def verify_db():
    print(f"\n{YELLOW}🔍 Verifying Database Schema & State...{RESET}\n")
    
    supabase = get_supabase_client()
    
    # 1. Check match_document_chunks function
    print("Checking RPC function 'match_document_chunks'...")
    try:
        # We can't query pg_proc directly via data API easily, so we test it
        # with a dummy call that is expected to fail with validation error, 
        # or return empty list, but not "function not found"
        
        # Creating a dummy embedding of correct size (1536)
        dummy_embedding = [0.0] * 1536
        
        res = supabase.rpc(
            'match_document_chunks',
            {
                'query_embedding': dummy_embedding,
                'match_threshold': 0.0,
                'match_count': 1,
                'document_ids': None
            }
        ).execute()
        
        print(f"{GREEN}✅ RPC function 'match_document_chunks' exists and is callable{RESET}")
        
    except Exception as e:
        error_msg = str(e).lower()
        if "function" in error_msg and "does not exist" in error_msg:
             print(f"{RED}❌ CRITICAL: 'match_document_chunks' function is MISSING!{RESET}")
             print(f"   Run step 6 from setup_database.sql in Supabase SQL Editor")
        else:
             print(f"{GREEN}✅ RPC function seems to exist (error was likely data related: {e}){RESET}")
    
    # 2. Check documents table for summary column
    print("\nChecking 'documents' table structure...")
    try:
        # Try to select the summary column
        res = supabase.table("documents").select("summary").limit(1).execute()
        print(f"{GREEN}✅ 'summary' column exists in documents table{RESET}")
    except Exception as e:
        print(f"{RED}❌ 'summary' column might be MISSING in documents table{RESET}")
        print(f"   Error: {e}")
        print(f"   Fix: ALTER TABLE documents ADD COLUMN IF NOT EXISTS summary TEXT;")

    # 3. Check for existing data
    print("\nChecking data state...")
    try:
        docs = supabase.table("documents").select("id, title, status").limit(5).execute()
        print(f"📄 Found {len(docs.data)} documents")
        for d in docs.data:
            print(f"   - {d['title']} ({d['status']})")
            
        chunks = supabase.table("document_chunks").select("id", count="exact").head().execute()
        count = chunks.count if hasattr(chunks, 'count') else "unknown"
        print(f"🧩 Total document chunks: {count}")
        
        if len(docs.data) > 0 and (count == 0 or count == "unknown"):
             print(f"{YELLOW}⚠️  WARNING: Documents exist but no chunks found. PDF processing might be failing.{RESET}")
             
    except Exception as e:
        print(f"{RED}❌ Failed to check data: {e}{RESET}")

    print("\n" + "="*50)
    print("Verification Complete")
    print("="*50)

if __name__ == "__main__":
    import sys
    # Add backend to path
    sys.path.append(str(Path.cwd()))
    asyncio.run(verify_db())
