"""
Check if DEV_MODE is loaded correctly
"""
from app.core.config import settings
from app.core.auth import DEV_MODE

print("="*60)
print("DEV_MODE Configuration Check")
print("="*60)
print(f"settings.DEV_MODE: {settings.DEV_MODE}")
print(f"auth.DEV_MODE: {DEV_MODE}")
print(f"Type: {type(settings.DEV_MODE)}")
print("="*60)

if DEV_MODE:
    print("✅ DEV_MODE is ENABLED - authentication should be bypassed")
else:
    print("❌ DEV_MODE is DISABLED - authentication is required")
