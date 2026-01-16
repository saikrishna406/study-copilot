"""
Save just the user ID to a file
"""
from app.core.auth import get_supabase_client

try:
    supabase = get_supabase_client()
    users = supabase.auth.admin.list_users()
    
    target_id = None
    for u in users:
        if u.email == "test@example.com":
            target_id = u.id
            break
            
    if target_id:
        with open("target_id.txt", "w", encoding="utf-8") as f:
            f.write(target_id)
        print("Done")
    else:
        print("User not found")

except Exception as e:
    print(f"Error: {e}")
