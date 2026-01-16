-- Run this in your Supabase SQL Editor to update the table structure

CREATE TABLE IF NOT EXISTS notebooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    document_ids UUID[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notebooks_user_id ON notebooks(user_id);

-- Trigger for updated_at
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_notebooks_updated_at') THEN
        CREATE TRIGGER update_notebooks_updated_at BEFORE UPDATE ON notebooks
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Enable RLS
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;

-- Policies (Drop first to avoid errors if re-running)
DROP POLICY IF EXISTS "Users can view their own notebooks" ON notebooks;
DROP POLICY IF EXISTS "Users can insert their own notebooks" ON notebooks;
DROP POLICY IF EXISTS "Users can update their own notebooks" ON notebooks;
DROP POLICY IF EXISTS "Users can delete their own notebooks" ON notebooks;

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
