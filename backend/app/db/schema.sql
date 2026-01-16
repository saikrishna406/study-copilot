-- StudyCopilot Database Schema
-- PostgreSQL with pgvector extension

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table (managed by Supabase Auth)
-- Reference: auth.users

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    page_count INTEGER,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);

-- Document chunks with embeddings
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),  -- OpenAI embedding dimension
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_chunks_embedding ON document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Chat sessions
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    sources JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);

-- Notes
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_ids UUID[] NOT NULL,
    title TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notes_user_id ON notes(user_id);

-- Quizzes
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_ids UUID[] NOT NULL,
    title TEXT,
    questions JSONB NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_quizzes_user_id ON quizzes(user_id);

-- Summaries
CREATE TABLE IF NOT EXISTS summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_ids UUID[] NOT NULL,
    content TEXT NOT NULL,
    length TEXT CHECK (length IN ('short', 'medium', 'long')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_summaries_user_id ON summaries(user_id);

-- Study plans
CREATE TABLE IF NOT EXISTS study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_ids UUID[] NOT NULL,
    title TEXT,
    plan JSONB NOT NULL,
    duration_days INTEGER NOT NULL,
    hours_per_day INTEGER NOT NULL,
    start_date DATE,
    exam_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_study_plans_user_id ON study_plans(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON study_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

-- Documents policies
CREATE POLICY "Users can view their own documents"
    ON documents FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
    ON documents FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
    ON documents FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
    ON documents FOR DELETE
    USING (auth.uid() = user_id);

-- Similar policies for other tables (abbreviated for brevity)
-- Apply same pattern for: document_chunks, chat_sessions, chat_messages, notes, quizzes, summaries, study_plans

-- Notebooks (Workspaces)
CREATE TABLE IF NOT EXISTS notebooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    document_ids UUID[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notebooks_user_id ON notebooks(user_id);

CREATE TRIGGER update_notebooks_updated_at BEFORE UPDATE ON notebooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notebooks"
    ON notebooks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notebooks"
    ON notebooks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notebooks"
    ON notebooks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notebooks"
    ON notebooks FOR DELETE
    USING (auth.uid() = user_id);

