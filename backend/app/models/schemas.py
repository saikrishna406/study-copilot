"""
Database models using Pydantic
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# User Models
class User(BaseModel):
    id: str
    email: str
    created_at: datetime

# Document Models
class DocumentCreate(BaseModel):
    title: str
    file_path: str

class Document(BaseModel):
    id: str
    user_id: str
    title: str
    file_path: str
    file_size: int
    page_count: Optional[int] = None
    status: str  # 'processing', 'ready', 'failed'
    created_at: datetime
    updated_at: datetime

# Chat Models
class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    document_ids: List[str]
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    session_id: str
    message: str
    sources: List[dict]

# Notes Models
class NotesRequest(BaseModel):
    document_ids: List[str]
    topic: Optional[str] = None

class NotesResponse(BaseModel):
    id: str
    title: Optional[str] = None
    content: str
    created_at: datetime
    document_ids: List[str] = []

# Quiz Models
class QuizRequest(BaseModel):
    document_ids: List[str]
    num_questions: int = 5
    difficulty: str = "medium"  # easy, medium, hard

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    explanation: str

class QuizResponse(BaseModel):
    id: str
    questions: List[QuizQuestion]
    created_at: datetime

# Summary Models
class SummaryRequest(BaseModel):
    document_ids: List[str]
    length: str = "medium"  # short, medium, long

class SummaryResponse(BaseModel):
    id: str
    content: str
    created_at: datetime

# Study Plan Models
class StudyPlanRequest(BaseModel):
    document_ids: List[str]
    exam_date: str # YYYY-MM-DD
    hours_per_day: int = 2

class StudyPlanResponse(BaseModel):
    id: str
    title: Optional[str] = None
    plan: dict
    status: str
    created_at: datetime

# Notebook Models
class NotebookCreate(BaseModel):
    title: str
    document_ids: Optional[List[str]] = []

class NotebookUpdate(BaseModel):
    title: Optional[str] = None
    document_ids: Optional[List[str]] = None

class NotebookResponse(BaseModel):
    id: str
    title: str
    document_ids: List[str]
    created_at: datetime
    updated_at: datetime

