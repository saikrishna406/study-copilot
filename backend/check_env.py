"""
Check if DEV_MODE environment variable is set
"""
import os

dev_mode = os.getenv("DEV_MODE", "false")
print(f"DEV_MODE environment variable: '{dev_mode}'")
print(f"DEV_MODE as boolean: {dev_mode.lower() == 'true'}")

# Also check all environment variables
print("\nAll environment variables containing 'DEV':")
for key, value in os.environ.items():
    if 'DEV' in key.upper():
        print(f"  {key} = {value}")
