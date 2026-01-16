-- Vector similarity search function for Supabase
-- This function enables semantic search across document chunks

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
