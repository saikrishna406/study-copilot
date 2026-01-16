"""
PDF text extraction service
"""
import PyPDF2
from typing import List, Dict
from io import BytesIO

class PDFExtractor:
    @staticmethod
    def extract_text(pdf_bytes: bytes) -> Dict[str, any]:
        """
        Extract text from PDF bytes
        Returns: {
            'text': str,
            'page_count': int,
            'pages': List[str]
        }
        """
        try:
            pdf_file = BytesIO(pdf_bytes)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            page_count = len(pdf_reader.pages)
            pages = []
            full_text = []
            
            for page_num in range(page_count):
                page = pdf_reader.pages[page_num]
                page_text = page.extract_text()
                pages.append(page_text)
                full_text.append(page_text)
            
            return {
                'text': '\n\n'.join(full_text),
                'page_count': page_count,
                'pages': pages
            }
            
        except Exception as e:
            raise Exception(f"Failed to extract text from PDF: {str(e)}")
    
    @staticmethod
    def chunk_text(pages: List[str], chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """
        Split text into overlapping chunks with page metadata
        """
        chunks = []
        
        for page_num, page_text in enumerate(pages, 1):
            if not page_text.strip():
                continue
                
            start = 0
            text_length = len(page_text)
            
            while start < text_length:
                end = start + chunk_size
                chunk_content = page_text[start:end]
                
                # Try to break at sentence boundary
                if end < text_length:
                    last_period = chunk_content.rfind('.')
                    last_newline = chunk_content.rfind('\n')
                    break_point = max(last_period, last_newline)
                    
                    if break_point > chunk_size * 0.5:
                        chunk_content = chunk_content[:break_point + 1]
                        end = start + break_point + 1
                
                # Prepend page metadata to the chunk content
                # This embed page info directly into the text for the LLM
                formatted_chunk = f"[Page {page_num}] {chunk_content.strip()}"
                chunks.append(formatted_chunk)
                
                start = end - overlap
                # Ensure we don't get stuck via infinite loop if overlap >= chunk_size (unlikely but safe)
                if start >= end:
                    start = end
                    
        return chunks
