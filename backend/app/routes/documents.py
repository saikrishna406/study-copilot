"""
Document management routes
"""
from fastapi import APIRouter, UploadFile, File, Depends, BackgroundTasks, HTTPException
from typing import List, Optional
from app.core.auth import get_current_user
from app.services.document_service import DocumentService
from app.services.pdf_extractor import PDFExtractor
from app.services.embedding_service import EmbeddingService
from app.services.summary_service import SummaryService
from app.core.auth import get_supabase_client
from app.core.config import settings
import traceback
import sys

router = APIRouter()

async def process_document_background(document_id: str, file_path: str):
    """Background task to process uploaded PDF"""
    print(f"🚀 [BgTask] Starting processing for document {document_id}")
    supabase = get_supabase_client()
    
    try:
        # 1. Download PDF from storage
        print(f"📥 [BgTask] Downloading file: {file_path}")
        try:
            file_data = supabase.storage.from_("documents").download(file_path)
        except Exception as e:
            print(f"❌ [BgTask] Download failed: {e}")
            raise Exception(f"Failed to download file from storage: {e}")
        
        # 2. Extract text
        print(f"📄 [BgTask] Extracting text...")
        extractor = PDFExtractor()
        try:
            extracted = extractor.extract_text(file_data)
            print(f"✅ [BgTask] Extraction complete. Pages: {extracted.get('page_count')}, Text length: {len(extracted.get('text', ''))}")
        except Exception as e:
            print(f"❌ [BgTask] Text extraction failed: {e}")
            raise Exception(f"Text extraction failed: {e}")
        
        # 3. Update page count
        supabase.table("documents").update({
            "page_count": extracted['page_count']
        }).eq("id", document_id).execute()
        
        # 4. Chunk text
        print(f"🔪 [BgTask] Chunking text...")
        chunks = extractor.chunk_text(
            extracted['pages'],
            chunk_size=settings.CHUNK_SIZE,
            overlap=settings.CHUNK_OVERLAP
        )
        print(f"✅ [BgTask] Created {len(chunks)} chunks")
        
        if not chunks:
            print(f"⚠️ [BgTask] No chunks created from document")
            # Creating at least one chunk if text exists but is small
            if extracted['text'].strip():
                # Fallback: treat as Page 1
                chunks = [f"[Page 1] {extracted['text'].strip()}"]
            else:
                raise Exception("Document appears to be empty (no text extracted)")

        # 5. Generate embeddings
        print(f"🧠 [BgTask] Generating embeddings for {len(chunks)} chunks...")
        embedding_service = EmbeddingService()
        try:
            embeddings = await embedding_service.create_embeddings_batch(chunks)
            print(f"✅ [BgTask] Embeddings generated successfully")
        except Exception as e:
            print(f"❌ [BgTask] Embedding generation failed: {e}")
            # Identify if it's an API key issue
            if "api_key" in str(e).lower() or "authentication" in str(e).lower():
                print("❌ [BgTask] CRITICAL: OpenAI API Key invalid or expired")
            raise Exception(f"Embedding generation failed: {e}")
        
        # 6. Store chunks with embeddings
        print(f"💾 [BgTask] Saving chunks to database...")
        chunk_records = []
        for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            chunk_records.append({
                "document_id": document_id,
                "chunk_index": idx,
                "content": chunk,
                "embedding": embedding
            })
        
        if chunk_records:
            try:
                # Insert in batches of 50 to avoid request size limits
                batch_size = 50
                for i in range(0, len(chunk_records), batch_size):
                    batch = chunk_records[i:i + batch_size]
                    supabase.table("document_chunks").insert(batch).execute()
                print(f"✅ [BgTask] Saved {len(chunk_records)} chunks to DB")
            except Exception as e:
                print(f"❌ [BgTask] Database insertion failed: {e}")
                raise Exception(f"Failed to save chunks to database: {e}")
        
        # 7. Generate Summary (Optional but good)
        print(f"📝 [BgTask] Generating summary...")
        summary_service = SummaryService()
        try:
            summary = await summary_service.generate_summary(extracted['text'])
            # Check if summary column exists first or handle error
            try:
                supabase.table("documents").update({
                    "summary": summary
                }).eq("id", document_id).execute()
                print(f"✅ [BgTask] Summary saved")
            except Exception as db_e:
                print(f"⚠️ [BgTask] Could not save summary (column might be missing): {db_e}")
        except Exception as e:
            print(f"⚠️ [BgTask] Summary generation failed: {e}")
            # Don't fail the whole process if summary fails
        
        # 8. Update document status to ready
        supabase.table("documents").update({
            "status": "ready"
        }).eq("id", document_id).execute()
        print(f"✨ [BgTask] Document {document_id} processing COMPLETE!")
        
    except Exception as e:
        # Mark as failed
        print(f"❌ [BgTask] FAILURE processing document {document_id}")
        traceback.print_exc()
        
        # Try to save error message if possible
        error_msg = str(e)
        update_data = {"status": "failed"}
        
        # Try to save error info in title or summary for visibility if possible
        # Or just leave it as failed
        
        supabase.table("documents").update(update_data).eq("id", document_id).execute()
        print(f"Error processing document {document_id}: {str(e)}")

@router.post("/upload")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload a PDF document"""
    doc_service = DocumentService()
    document = await doc_service.upload_document(file, current_user["user_id"])
    
    # Process document in background
    background_tasks.add_task(
        process_document_background,
        document["id"],
        document["file_path"]
    )
    
    return document

@router.get("")
async def get_documents(current_user: dict = Depends(get_current_user)):
    """Get all documents for current user"""
    doc_service = DocumentService()
    return await doc_service.get_user_documents(current_user["user_id"])

@router.get("/{document_id}")
async def get_document(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific document"""
    doc_service = DocumentService()
    return await doc_service.get_document(document_id, current_user["user_id"])

@router.get("/{document_id}/status")
async def get_document_status(
    document_id: str, 
    current_user: dict = Depends(get_current_user)
):
    """Get specific document processing status"""
    supabase = get_supabase_client()
    
    # Get document
    result = supabase.table("documents")\
        .select("id, status, error_message, created_at, page_count")\
        .eq("id", document_id)\
        .eq("user_id", current_user["user_id"])\
        .single()\
        .execute()
        
    if not result.data:
        raise HTTPException(status_code=404, detail="Document not found")
        
    doc = result.data
    
    # Get chunk count to see progress
    chunks_count = 0
    try:
        chunks_res = supabase.table("document_chunks")\
            .select("id", count="exact")\
            .eq("document_id", document_id)\
            .execute()
        chunks_count = chunks_res.count
    except:
        pass
        
    return {
        "id": doc["id"],
        "status": doc["status"],
        "page_count": doc.get("page_count"),
        "chunks_created": chunks_count,
        "is_ready": doc["status"] == "ready"
    }

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete a document"""
    doc_service = DocumentService()
    return await doc_service.delete_document(document_id, current_user["user_id"])
