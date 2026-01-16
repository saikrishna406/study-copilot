# Quick Fix for 401 Authentication Error

## Problem
The file upload is failing with 401 Unauthorized because the user is not logged in.

## Solution
I've added a **DEV_MODE** flag to bypass authentication for testing.

## Steps to Fix

### 1. Stop the current backend server
Press `Ctrl + C` in the terminal running the backend

### 2. Add DEV_MODE to your .env file
The backend `.env` file should now include:
```
DEV_MODE=true
```

### 3. Restart the backend server
```bash
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 4. Try uploading again
The upload should now work without requiring login!

## What Changed
- Modified `backend/app/core/auth.py` to allow optional authentication in DEV_MODE
- When DEV_MODE=true, the backend uses a test user instead of requiring JWT tokens
- This allows you to test file uploads without implementing full authentication

## For Production
**IMPORTANT:** Set `DEV_MODE=false` or remove it entirely before deploying to production!

## Alternative: Implement Login
If you want to test with real authentication, you'll need to:
1. Implement the login page
2. Set up Supabase authentication
3. Ensure users can sign up/sign in
4. Then uploads will work with real user tokens
