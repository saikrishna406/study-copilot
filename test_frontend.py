"""
Frontend Environment and Configuration Test
"""
import os
import json
from pathlib import Path

print("="*60)
print("🧪 FRONTEND TESTING")
print("="*60)

# Test 1: Check package.json
print("\n📦 Package Configuration")
package_json = Path("package.json")
if package_json.exists():
    print("✅ package.json found")
    with open(package_json) as f:
        data = json.load(f)
        print(f"   Name: {data.get('name', 'N/A')}")
        print(f"   Version: {data.get('version', 'N/A')}")
        
        # Check key dependencies
        deps = data.get('dependencies', {})
        dev_deps = data.get('devDependencies', {})
        all_deps = {**deps, **dev_deps}
        
        critical_deps = ['next', 'react', 'typescript']
        for dep in critical_deps:
            if dep in all_deps:
                print(f"   ✅ {dep}: {all_deps[dep]}")
            else:
                print(f"   ❌ {dep}: NOT FOUND")
else:
    print("❌ package.json not found")

# Test 2: Check environment files
print("\n🔐 Environment Configuration")
env_files = [".env.local", ".env", "env.local.example"]
found_env = False
for env_file in env_files:
    if Path(env_file).exists():
        print(f"✅ {env_file} found")
        found_env = True
    else:
        print(f"⚠️  {env_file} not found")

if not found_env:
    print("❌ No environment files found")

# Test 3: Check source structure
print("\n📁 Source Structure")
src_paths = [
    "src",
    "src/app",
    "src/components",
    "src/hooks",
    "src/lib"
]

for path in src_paths:
    if Path(path).exists():
        print(f"✅ {path}/")
    else:
        print(f"❌ {path}/ missing")

# Test 4: Check critical files
print("\n📄 Critical Files")
critical_files = [
    "next.config.js",
    "tsconfig.json",
    "tailwind.config.ts"
]

for file in critical_files:
    if Path(file).exists():
        print(f"✅ {file}")
    else:
        print(f"⚠️  {file} missing")

# Test 5: Check node_modules
print("\n📚 Dependencies Installation")
if Path("node_modules").exists():
    print("✅ node_modules directory exists")
    
    # Check for specific packages
    critical_packages = [
        "node_modules/next",
        "node_modules/react",
        "node_modules/typescript"
    ]
    
    for pkg in critical_packages:
        if Path(pkg).exists():
            print(f"   ✅ {pkg.split('/')[-1]} installed")
        else:
            print(f"   ❌ {pkg.split('/')[-1]} not installed")
else:
    print("❌ node_modules not found - run 'npm install'")

print("\n" + "="*60)
print("✅ Frontend structure check complete")
print("="*60)
