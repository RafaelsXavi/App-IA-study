# upload.py
# Schema para upload de PDF

from pydantic import BaseModel
from typing import List

class PDFProcessResponse(BaseModel):
    filename: str
    total_chunks: int
    chunks: List[str]
