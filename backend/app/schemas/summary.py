# summary.py
# Schema para resumo

from pydantic import BaseModel
from typing import List

class SummaryRequest(BaseModel):
    chunks: List[str]
    level: str

class SummaryResponse(BaseModel):
    summary: str
