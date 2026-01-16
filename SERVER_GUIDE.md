# 🚀 Server Running Guide

## ✅ Backend Server Status: RUNNING

**Server URL:** http://127.0.0.1:8000  
**Health Check:** ✅ Status 200 - Healthy  
**API Docs:** http://127.0.0.1:8000/docs

---

## 🔧 How to Start Backend (Use This Command)

```bash
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

> **Note:** Use `python -m uvicorn` instead of just `uvicorn` on Windows if uvicorn isn't in your PATH.

---

## 🎨 Start Frontend (Next Step)

Open a **new terminal** and run:

```bash
npm run dev
```

Then access the app at: **http://localhost:3000**

---

## 📡 Available Endpoints

- **Root:** http://127.0.0.1:8000/
- **Health Check:** http://127.0.0.1:8000/health
- **API Documentation:** http://127.0.0.1:8000/docs (Interactive Swagger UI)
- **Chat API:** http://127.0.0.1:8000/api/chat/query
- **Documents API:** http://127.0.0.1:8000/api/documents/upload

---

## 🧪 Quick API Test

Test the health endpoint:
```bash
curl http://127.0.0.1:8000/health
```

Expected response:
```json
{"status": "healthy"}
```

---

## 🛑 Stop the Server

Press `Ctrl + C` in the terminal where the server is running.

---

## ✅ Current Status

- ✅ Backend server running on port 8000
- ✅ OpenAI API configured and working
- ✅ Supabase connected
- ✅ All routes loaded successfully

**Ready to use!** 🎉
