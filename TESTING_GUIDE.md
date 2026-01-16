# Quick Start Guide - StudyCopilot Testing

## 🚀 Start Backend Server
```bash
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## 🎨 Start Frontend Server
```bash
npm run dev
```

## 🧪 Run Tests

### Backend Tests
```bash
cd backend
python test_backend.py
```

### Frontend Tests
```bash
python test_frontend.py
```

### Server Health Check
```bash
python test_server_health.py
```

## 📍 Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs
- **Health Check:** http://localhost:8000/health

## ✅ Test Results
All tests passed! See `walkthrough.md` for detailed results.
