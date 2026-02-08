from pydantic import BaseModel
from typing import List

class SummaryRequest(BaseModel):
    """
    Modelo de requisição para gerar um resumo.
    Recebe os chunks de texto e o nível do estudante.
    """
    chunks: List[str]
    level: str

class SummaryResponse(BaseModel):
    """
    Modelo de resposta contendo o resumo final gerado.
    """
    summary: str
