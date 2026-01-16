"""
FastAPI Backend for StudyCopilot
Main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import auth, documents, chat, notes, quiz, summary, planner, notebooks

app = FastAPI(
    title="StudyCopilot API",
    description="AI-powered study assistant with RAG capabilities",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(summary.router, prefix="/api/summary", tags=["Summary"])
app.include_router(planner.router, prefix="/api/planner", tags=["Planner"])
app.include_router(notebooks.router, prefix="/api/notebooks", tags=["Notebooks"])

@app.get("/")
async def root():
    return {
        "message": "StudyCopilot API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
