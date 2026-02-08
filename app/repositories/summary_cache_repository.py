
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.summary_cache import SummaryCache

async def get_cached_summary(db: AsyncSession, document_id: str, student_level: str) -> SummaryCache | None:
    """
    Busca um resumo em cache no banco de dados.
    """
    stmt = select(SummaryCache).where(
        SummaryCache.document_id == document_id,
        SummaryCache.student_level == student_level
    )
    result = await db.execute(stmt)
    return result.scalars().first()

async def save_summary_to_cache(db: AsyncSession, document_id: str, student_level: str, summary_text: str) -> SummaryCache:
    """
    Salva um novo resumo gerado no banco de dados de cache.
    """
    new_cache_entry = SummaryCache(
        document_id=document_id,
        student_level=student_level,
        summary_text=summary_text
    )
    db.add(new_cache_entry)
    await db.commit()
    await db.refresh(new_cache_entry)
    return new_cache_entry
