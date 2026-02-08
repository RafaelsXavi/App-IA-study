
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, UniqueConstraint, func
)
from app.database import Base

class SummaryCache(Base):
    """
    Modelo SQLAlchemy para armazenar resumos gerados em cache.
    """
    __tablename__ = "summary_cache"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String, nullable=False, index=True)
    student_level = Column(String, nullable=False, index=True)
    summary_text = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Garante que a combinação de um documento e um nível de estudante seja única.
    __table_args__ = (
        UniqueConstraint('document_id', 'student_level', name='_document_level_uc'),
    )
