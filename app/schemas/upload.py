
from pydantic import BaseModel
from typing import List

class PDFProcessResponse(BaseModel):
    """
    Modelo de resposta para o processamento de um PDF.
    Retorna metadados e o conteúdo fatiado (chunks).
    """
    filename: str
    total_chunks: int
    chunks: List[str]

    class Config:
        from_attributes = True
