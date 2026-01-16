# StudyCopilot Backend API

Production-grade Python FastAPI backend for StudyCopilot - an AI-powered study assistant with RAG capabilities.

## 🏗️ Tech Stack

- **Framework**: FastAPI
- **Database**: Supabase (PostgreSQL + pgvector)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth (JWT)
- **AI**: OpenAI API (GPT-4 + Embeddings)
- **Vector Search**: pgvector

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── core/
│   │   ├── config.py        # Settings & configuration
│   │   └── auth.py          # JWT auth middleware
│   ├── db/
│   │   └── schema.sql       # Database schema
│   ├── models/
│   │   └── schemas.py       # Pydantic models
│   ├── routes/
│   │   ├── auth.py          # Auth endpoints
│   │   ├── documents.py     # Document management
│   │   ├── chat.py          # RAG chat
│   │   ├── notes.py         # Notes generation
│   │   ├── quiz.py          # Quiz generation
│   │   ├── summary.py       # Summary generation
│   │   └── planner.py       # Study planner
│   └── services/
│       ├── document_service.py
│       ├── pdf_extractor.py
│       └── embedding_service.py
├── requirements.txt
├── env.example
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Setup Environment Variables

Copy `env.example` to `.env` and fill in your credentials:

```bash
cp env.example .env
```

Required variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_KEY`: Supabase service role key
- `SUPABASE_JWT_SECRET`: Supabase JWT secret
- `OPENAI_API_KEY`: Your OpenAI API key

### 3. Setup Database

Run the SQL schema in your Supabase SQL editor:

```bash
# Copy contents of app/db/schema.sql to Supabase SQL Editor
```

This will:
- Enable pgvector extension
- Create all necessary tables
- Setup indexes and RLS policies
- Create vector similarity search function

### 4. Create Supabase Storage Bucket

In Supabase Dashboard:
1. Go to Storage
2. Create a new bucket named `documents`
3. Set it to private (authenticated users only)

### 5. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📡 API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user info

### Documents
- `POST /api/documents/upload` - Upload PDF
- `GET /api/documents` - List user documents
- `GET /api/documents/{id}` - Get document details
- `DELETE /api/documents/{id}` - Delete document

### Chat (RAG)
- `POST /api/chat/query` - Ask questions about documents
- `GET /api/chat/sessions` - List chat sessions
- `GET /api/chat/sessions/{id}` - Get session with messages

### AI Generators (Phase 3 - Placeholders)
- `POST /api/notes/generate` - Generate notes
- `POST /api/quiz/generate` - Generate quiz
- `POST /api/summary/generate` - Generate summary
- `POST /api/planner/generate` - Generate study plan

## 🔐 Authentication

All endpoints (except health check) require authentication. Include the Supabase JWT token in the Authorization header:

```bash
Authorization: Bearer <your_supabase_jwt_token>
```

## 📝 Example Requests

### Upload a PDF

```bash
curl -X POST http://localhost:8000/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf"
```

### Chat with Documents

```bash
curl -X POST http://localhost:8000/api/chat/query \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "document_ids": ["doc-uuid-1", "doc-uuid-2"],
    "message": "What are the main topics covered?"
  }'
```

## 🧠 RAG Flow

1. **Upload**: PDF → Supabase Storage
2. **Extract**: PyPDF2 extracts text
3. **Chunk**: Text split into semantic chunks
4. **Embed**: OpenAI creates embeddings
5. **Store**: Chunks + embeddings → PostgreSQL (pgvector)
6. **Query**: User question → embedding → vector search → context
7. **Generate**: Context + question → OpenAI → answer

## 🗄️ Database Schema

Key tables:
- `documents` - PDF metadata
- `document_chunks` - Text chunks with vector embeddings
- `chat_sessions` - Conversation sessions
- `chat_messages` - Chat history
- `notes`, `quizzes`, `summaries`, `study_plans` - AI-generated content

## 🚢 Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Render

1. Connect your GitHub repo
2. Select "Web Service"
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

## 📊 Monitoring

Access FastAPI's built-in docs for testing:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔧 Development

### Run with auto-reload
```bash
uvicorn app.main:app --reload
```

### Run tests (to be added)
```bash
pytest
```

## 📦 Phase Roadmap

### ✅ Phase 1 (Current)
- FastAPI setup
- Supabase integration
- Auth middleware
- PDF upload & processing
- RAG chat system
- Database schema

### 🔄 Phase 2 (Next)
- Implement Notes generator
- Implement Quiz generator
- Implement Summary generator
- Implement Study planner
- Add caching layer
- Improve error handling

### 🔮 Phase 3 (Future)
- Background job queue (Celery)
- Rate limiting
- Usage analytics
- Multi-document synthesis
- Advanced RAG techniques

## 🐛 Troubleshooting

### Vector search not working
Make sure pgvector extension is enabled:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### PDF processing fails
Check file size limits and PDF format. Only standard PDFs are supported.

### Authentication errors
Verify your Supabase JWT secret matches your project settings.

## 📄 License

MIT

## 🤝 Contributing

This is a production-ready backend for StudyCopilot. Contributions welcome!
