"""
Check documents table schema
"""
from app.core.auth import get_supabase_client
import json

print("Checking schema...")

try:
    supabase = get_supabase_client()
    # Try to select summary from a doc
    res = supabase.table("documents").select("summary").limit(1).execute()
    print("Select summary successful!")
    print(res.data)

except Exception as e:
    print(f"Error selecting summary: {e}")
