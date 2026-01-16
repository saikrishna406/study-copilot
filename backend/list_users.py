"""
List all users to find the test user ID
"""
from app.core.auth import get_supabase_client
import sys

print("Listing users...")

try:
    supabase = get_supabase_client()
    users = supabase.auth.admin.list_users()
    
    for u in users:
        print(f"USER:{u.email}:{u.id}")

except Exception as e:
    print(f"Error: {e}")
