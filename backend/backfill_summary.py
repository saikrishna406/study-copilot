"""
Backfill summary for the specific document
"""
import asyncio
from app.services.summary_service import SummaryService
from app.core.auth import get_supabase_client
from app.services.pdf_extractor import PDFExtractor
from app.core.config import settings

DOC_ID = "f9cd8940-97e9-4c0b-9fd9-0a4d102ab6f7"

async def main():
    print(f"Backfilling summary for {DOC_ID}...")
    
    supabase = get_supabase_client()
    
    # Get document
    doc = supabase.table("documents").select("*").eq("id", DOC_ID).single().execute()
    if not doc.data:
        print("Document not found")
        return

    file_path = doc.data['file_path']
    print(f"Downloading file: {file_path}")
    
    # Download PDF
    file_data = supabase.storage.from_("documents").download(file_path)
    
    # Extract
    print("Extracting text...")
    extractor = PDFExtractor()
    extracted = extractor.extract_text(file_data)
    
    # Summarize
    print("Generating summary...")
    summary_service = SummaryService()
    summary = await summary_service.generate_summary(extracted['text'])
    
    print("Summary generated!")
    print(summary[:100] + "...")
    
    # Update DB
    supabase.table("documents").update({
        "summary": summary
    }).eq("id", DOC_ID).execute()
    
    print("Database updated!")

if __name__ == "__main__":
    asyncio.run(main())
