import asyncio
from app.services.notebook_service import NotebookService
from app.services.notes_service import NotesService
from app.core.auth import get_supabase_client

async def check_db():
    print("Checking Database Connection...")
    client = get_supabase_client()
    
    # 1. Check Specific Notebook Owner
    target_id = "62581de6-bb49-4ad7-b90c-fb8fcca1976c"
    res = client.table("notebooks").select("title,user_id").eq("id", target_id).execute()
    
    if res.data:
        print(f"NOTEBOOK_OWNER: {res.data[0]['user_id']}")
    else:
        print("NOTEBOOK_NOT_FOUND")

if __name__ == "__main__":
    asyncio.run(check_db())

    # 2. Check Notes Table
    try:
        print("\n--- Checking Notes Table ---")
        res = client.table("notes").select("*").limit(5).execute()
        print(f"Success! Found {len(res.data)} notes.")
        for note in res.data:
            print(f"- {note.get('title', 'No Title')} (ID: {note['id']})")
    except Exception as e:
        print(f"FAILED to query notes table: {e}")

    # 3. Check RLS Policies (Implicitly)
    # The client here uses SERVICE_ROLE_KEY if configured in settings as SUPABASE_SERVICE_ROLE_KEY
    # OR it uses common anon key if that's what's in settings.
    # If it uses ANON key, it won't see data unless RLS allows it for 'anon' (which it shouldn't) 
    # OR we are simulating a user.
    # However, `get_supabase_client` usually creates a client. 
    # Let's check permissions by trying to insert if empty? No, checking read is enough.

if __name__ == "__main__":
    asyncio.run(check_db())
