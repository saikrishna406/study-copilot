-- ============================================
-- StudyCopilot Complete Database Setup
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Step 1: Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Create tables
-- ============================================

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    page_count INTEGER,
    status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'ready', 'failed')),
    summary TEXT,
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
    plan JSONB NOT NULL,
    duration_days INTEGER NOT NULL,
    hours_per_day INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_study_plans_user_id ON study_plans(user_id);

-- Step 3: Create update triggers
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_plans_updated_at BEFORE UPDATE ON study_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 4: Enable Row Level Security
-- ============================================

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS Policies
-- ============================================

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

-- Document chunks policies (inherit from documents)
CREATE POLICY "Users can view chunks of their documents"
    ON document_chunks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_chunks.document_id 
            AND documents.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert chunks for their documents"
    ON document_chunks FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_chunks.document_id 
            AND documents.user_id = auth.uid()
        )
    );

-- Chat sessions policies
CREATE POLICY "Users can view their own chat sessions"
    ON chat_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat sessions"
    ON chat_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions"
    ON chat_sessions FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat sessions"
    ON chat_sessions FOR DELETE
    USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can view messages in their sessions"
    ON chat_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM chat_sessions 
            WHERE chat_sessions.id = chat_messages.session_id 
            AND chat_sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages in their sessions"
    ON chat_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_sessions 
            WHERE chat_sessions.id = chat_messages.session_id 
            AND chat_sessions.user_id = auth.uid()
        )
    );

-- Notes policies
CREATE POLICY "Users can manage their own notes"
    ON notes FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Quizzes policies
CREATE POLICY "Users can manage their own quizzes"
    ON quizzes FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Summaries policies
CREATE POLICY "Users can manage their own summaries"
    ON summaries FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Study plans policies
CREATE POLICY "Users can manage their own study plans"
    ON study_plans FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Step 6: Create Vector Search Function
-- ============================================

CREATE OR REPLACE FUNCTION match_document_chunks(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 5,
    document_ids uuid[] DEFAULT NULL
)
RETURNS TABLE (
    id uuid,
    document_id uuid,
    content text,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        document_chunks.id,
        document_chunks.document_id,
        document_chunks.content,
        1 - (document_chunks.embedding <=> query_embedding) AS similarity
    FROM document_chunks
    WHERE 
        (document_ids IS NULL OR document_chunks.document_id = ANY(document_ids))
        AND 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
    ORDER BY document_chunks.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ============================================
-- Setup Complete! 
-- Next: Create 'documents' storage bucket in Supabase Storage
-- ============================================
