
import os
from dotenv import load_dotenv
load_dotenv('.env.local')

from app.core.auth import get_supabase_client

def check_schema():
    supabase = get_supabase_client()
    try:
        # Try to insert a dummy record to see if columns exist, or just select basic info
        # Supabase-js client doesn't expose schema info easily, but we can try to select specific columns
        # If columns don't exist, it should error.
        
        print("Checking study_plans table...")
        try:
            # Try to select the new columns
            res = supabase.table("study_plans").select("id, title, start_date, exam_date, status").limit(1).execute()
            print("Columns exist. Query result:", res)
        except Exception as e:
            print("Error selecting columns. Schema might be outdated.")
            print(e)
            
        # Also check if we can insert a dummy plan (and delete it) to verify constraints
        print("\nAttempting dry-run insertion...")
        # We won't actually insert unless we want to, but constructing the object helps.
        
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    check_schema()
