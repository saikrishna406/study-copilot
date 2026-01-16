import sys
from pathlib import Path

# Add backend to path
sys.path.append(str(Path.cwd() / "backend"))

print("Checking imports...")

try:
    from app.routes import documents
    print("✅ app.routes.documents imported successfully")
except Exception as e:
    print(f"❌ Failed to import documents: {e}")
    sys.exit(1)

try:
    from app.routes import chat
    print("✅ app.routes.chat imported successfully")
except Exception as e:
    print(f"❌ Failed to import chat: {e}")
    sys.exit(1)

print("All critical modules are valid!")
