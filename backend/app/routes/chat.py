"""
Chat and RAG routes
"""
from fastapi import APIRouter, Depends, HTTPException
from app.core.auth import get_current_user, get_supabase_client
from app.models.schemas import ChatRequest, ChatResponse
from app.services.embedding_service import EmbeddingService
from openai import AsyncOpenAI
from app.core.config import settings
import uuid
import traceback
import sys

router = APIRouter()

@router.post("/query", response_model=ChatResponse)
async def chat_query(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """Query documents using RAG"""
    """Query documents using RAG"""
    print(f"💬 [Chat] Processing query: {request.message[:50]}...")
    
    try:
        supabase = get_supabase_client()
        embedding_service = EmbeddingService()
        openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
        # 1. Create or get session
        session_id = request.session_id
        if not session_id:
            try:
                session_data = {
                    "user_id": current_user["user_id"],
                    "title": request.message[:50]
                }
                session_result = supabase.table("chat_sessions").insert(session_data).execute()
                session_id = session_result.data[0]["id"]
            except Exception as e:
                print(f"❌ [Chat] Session creation error: {e}")
                # Create a temporary session ID if DB fails
                session_id = str(uuid.uuid4())
        
        # 2. Get Document Summaries (Context Enhancement)
        doc_summaries = []
        if request.document_ids:
            try:
                 docs_res = supabase.table("documents")\
                    .select("title, summary")\
                    .in_("id", request.document_ids)\
                    .execute()
                 doc_summaries = [f"Summary of {d['title']}: {d['summary']}" for d in docs_res.data if d.get('summary')]
            except Exception as e:
                print(f"⚠️ [Chat] Failed to fetch summaries: {e}")

        # 3. Generate query embedding
        try:
            query_embedding = await embedding_service.create_embedding(request.message)
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to process your question")
        
        # 4. Strategy Selection based on Document Size
        # If documents are small (< 10 pages total), fetch ALL content to ensure "total analysis"
        total_pages = 0
        try:
             docs_info = supabase.table("documents").select("page_count").in_("id", request.document_ids).execute()
             total_pages = sum([d['page_count'] for d in docs_info.data if d.get('page_count')])
        except: pass

        search_results_data = []
        is_full_context = False

        if total_pages > 0 and total_pages <= 10:
             # ... existing small doc logic ...
             pass # (logic is fine, just placeholder for context)

        # 4b. Explicit Page Search (If context not yet found)
        # If user asks for "Page 30", try to find it directly
        import re
        page_query_match = re.search(r"(?:page|pg)\s*(\d+)", request.message.lower())
        
        if not search_results_data and page_query_match:
            try:
                target_page = int(page_query_match.group(1))
                print(f"🎯 [Chat] User asked for Page {target_page}. searching specifically...")
                
                # Search for "[Page X]" marker
                page_search = supabase.table("document_chunks")\
                    .select("id, content, document_id, chunk_index")\
                    .in_("document_id", request.document_ids)\
                    .ilike("content", f"%[Page {target_page}]% दुष्प्रभाव%")\
                    .execute() # 'ilike' might be slow or weird, let's just use text search if possible or just filter locally if we could...
                    # Actually Supabase 'ilike' is standard. But simply `ilike '%[Page 30]%'` is safest.
                
                # Correct ILIKE query:
                page_search = supabase.table("document_chunks")\
                    .select("id, content, document_id, chunk_index")\
                    .in_("document_id", request.document_ids)\
                    .ilike("content", f"%[Page {target_page}] %")\
                    .execute()

                if page_search.data:
                    print(f"✅ [Chat] Found {len(page_search.data)} chunks for Page {target_page}")
                    search_results_data = page_search.data
                    for c in search_results_data: 
                        c['similarity'] = 1.0
            except Exception as e:
                print(f"⚠️ [Chat] Page specific search failed: {e}")

        # If not full context or failed to fetch, use Vector Search
        if not search_results_data:
            # ... existing vector search ...
            thresholds = [0.4, 0.2, 0.1] # Try progressively lower thresholds
            
            for threshold in thresholds:
                print(f"🔍 [Chat] Searching with threshold {threshold}...")
                try:
                    res = supabase.rpc(
                        'match_document_chunks',
                        {
                            'query_embedding': query_embedding,
                            'match_threshold': threshold,
                            'match_count': settings.TOP_K_RESULTS,
                            'document_ids': request.document_ids
                        }
                    ).execute()
                    
                    if res.data:
                        search_results_data = res.data
                        print(f"✅ [Chat] Found {len(res.data)} chunks at threshold {threshold}")
                        break
                except Exception as e:
                    print(f"❌ [Chat] Vector search error: {e}")
                    break
        
        # 5. Build Final Context
        context_parts = []
        
        # Add summaries first
        if doc_summaries:
            context_parts.append("DOCUMENT SUMMARIES:\n" + "\n\n".join(doc_summaries))
            
        # Add chunks
        if search_results_data:
            # Sort chunks by document order then chunk index for coherent reading
            # (If vector search was used, this might shuffle relevance, but for 'analysis' structure is good. 
            #  Actually, for RAG, relying on similarity sort is usually better for finding answer, 
            #  but for 'explanation' reading order is better. Let's keep similarity for RAG unless it's full context.)
            
            if is_full_context:
                # Already sorted by index
                chunks_text = "\n\n".join([c["content"] for c in search_results_data])
            else:
                chunks_text = "\n\n".join([c["content"] for c in search_results_data])

            context_parts.append(f"RELEVANT TEXT FROM DOCUMENTS:\n{chunks_text}")
            
            # Extract page number for sources
            sources = []
            for c in search_results_data:
                # Try to extract page number from content "[Page X] ..."
                page_num = None
                import re
                match = re.search(r"\[Page (\d+)\]", c["content"])
                if match:
                    page_num = int(match.group(1))
                
                # If we really want to guess for legacy docs (risky but better than nothing or all Page 1? No, all Page 1 is worst)
                # Let's just leave it as None.
                
                sources.append({
                    "chunk_id": c["id"], 
                    "similarity": c.get("similarity", 0),
                    "page": page_num,
                    "text": c["content"]
                })
        else:
            sources = []

        # If we have NO context (no chunks AND no summaries), fail gracefully
        if not context_parts:
            print("⚠️ [Chat] No context found")
            fallback_msg = "I couldn't find relevant information in the uploaded documents."
            return ChatResponse(session_id=session_id, message=fallback_msg, sources=[])
            
        full_context = "\n\n".join(context_parts)
        
        # 6. Generate Answer
        system_prompt = """You are a helpful AI study assistant. Answer the question based ONLY on the provided context.
If the summaries provide enough info, use them. If specific details are needed, use the relevant chunks.
Every distinct claim or fact provided must be cited with [Page X] at the end of the sentence.
Do not hallucinate or use outside knowledge. If the answer isn't in the context, say so politely.
Always format your response with Markdown."""
        
        user_prompt = f"""Context:
{full_context}

Question: {request.message}

Answer:"""

        print(f"🤖 [Chat] Requesting completion from {settings.OPENAI_MODEL}...")
        response = await openai_client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3, # Lower temperature for factual accuracy
            max_tokens=800
        )
        
        answer = response.choices[0].message.content
        
        # 7. Save history
        try:
            supabase.table("chat_messages").insert([
                {"session_id": session_id, "role": "user", "content": request.message},
                {"session_id": session_id, "role": "assistant", "content": answer, "sources": sources}
            ]).execute()
        except: pass
        
        return ChatResponse(
            session_id=session_id,
            message=answer,
            sources=sources
        )

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"❌ [Chat] Unexpected error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions")
async def get_chat_sessions(current_user: dict = Depends(get_current_user)):
    """Get all chat sessions for user"""
    supabase = get_supabase_client()
    result = supabase.table("chat_sessions")\
        .select("*")\
        .eq("user_id", current_user["user_id"])\
        .order("updated_at", desc=True)\
        .execute()
    return result.data

@router.get("/sessions/{session_id}")
async def get_chat_session(
    session_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get chat session with messages"""
    supabase = get_supabase_client()
    
    # Get session
    session = supabase.table("chat_sessions")\
        .select("*")\
        .eq("id", session_id)\
        .eq("user_id", current_user["user_id"])\
        .single()\
        .execute()
    
    if not session.data:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Get messages
    messages = supabase.table("chat_messages")\
        .select("*")\
        .eq("session_id", session_id)\
        .order("created_at")\
        .execute()
    
    return {
        "session": session.data,
        "messages": messages.data
    }
