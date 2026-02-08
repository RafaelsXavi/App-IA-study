
import pdfplumber
import logging
import asyncio
import hashlib
import time
from typing import List, IO
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from ..core.config import CHUNK_SIZE, CHUNK_OVERLAP
from .ai_service import call_google_ai_for_summary
from ..repositories import summary_cache_repository

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MAX_CHUNKS_FOR_SUMMARY = 10

def extract_text_from_pdf(pdf_file_stream: IO[bytes]) -> str:
    try:
        with pdfplumber.open(pdf_file_stream) as pdf:
            full_text = "".join(page.extract_text() or "" for page in pdf.pages)
        logger.info(f"Texto extraído com sucesso. Total de {len(full_text)} caracteres.")
        return full_text
    except Exception as e:
        logger.error(f"Erro ao extrair texto do PDF: {e}")
        raise ValueError("Não foi possível processar o arquivo PDF.")

def chunk_text(text: str) -> List[str]:
    if not text:
        return []
    final_chunks = []
    start_index = 0
    while start_index < len(text):
        end_index = start_index + CHUNK_SIZE
        chunk = text[start_index:end_index]
        final_chunks.append(chunk)
        start_index += CHUNK_SIZE - CHUNK_OVERLAP
    logger.info(f"Texto fatiado em {len(final_chunks)} chunks.")
    return final_chunks

async def _summarize_chunk(chunk: str) -> str:
    prompt = f"Resuma o seguinte fragmento de texto de forma concisa em português do Brasil, extraindo os pontos mais importantes:\n---\n{chunk}"
    return await call_google_ai_for_summary(prompt)

async def summarize_text_map_reduce(chunks: List[str], level: str) -> str:
    logger.info(f"Iniciando sumarização MapReduce para {len(chunks)} chunks.")
    
    if len(chunks) > MAX_CHUNKS_FOR_SUMMARY:
        logger.warning(f"Número de chunks ({len(chunks)}) excede o limite de {MAX_CHUNKS_FOR_SUMMARY}. Apenas os primeiros {MAX_CHUNKS_FOR_SUMMARY} serão usados.")
    
    limited_chunks = chunks[:MAX_CHUNKS_FOR_SUMMARY]
    
    map_start_time = time.time()
    logger.info("Iniciando fase MAP...")
    tasks = [_summarize_chunk(chunk) for chunk in limited_chunks]
    chunk_summaries = await asyncio.gather(*tasks)
    map_duration = time.time() - map_start_time
    logger.info(f"Fase MAP concluída em {map_duration:.2f} segundos.")

    combined_summaries = "\n\n---\n\n".join(chunk_summaries)

    reduce_start_time = time.time()
    logger.info("Iniciando fase REDUCE...")
    reduce_prompt = f"Combine os seguintes resumos parciais em um único resumo final, coeso e bem-estruturado em português do Brasil. Adapte a linguagem para um estudante de nível '{level}'. Organize com cabeçalhos e listas em markdown.\n\nResumos:\n---\n{combined_summaries}"
    final_summary = await call_google_ai_for_summary(reduce_prompt)
    reduce_duration = time.time() - reduce_start_time
    logger.info(f"Fase REDUCE concluída em {reduce_duration:.2f} segundos.")
    
    logger.info("Sumarização MapReduce concluída com sucesso.")
    return final_summary

def _create_document_id(chunks: List[str]) -> str:
    full_text = "".join(chunks)
    return hashlib.sha256(full_text.encode('utf-8')).hexdigest()

async def generate_summary_with_cache(db: AsyncSession, chunks: List[str], level: str) -> str:
    document_id = _create_document_id(chunks)
    logger.info(f"Verificando cache para document_id: {document_id}, level: {level}")

    cached_summary = await summary_cache_repository.get_cached_summary(
        db=db, document_id=document_id, student_level=level
    )

    if cached_summary:
        logger.info(f"Cache HIT para document_id: {document_id}")
        return cached_summary.summary_text

    logger.info(f"Cache MISS para document_id: {document_id}. Gerando novo resumo.")
    try:
        final_summary = await summarize_text_map_reduce(chunks=chunks, level=level)

        await summary_cache_repository.save_summary_to_cache(
            db=db, document_id=document_id, student_level=level, summary_text=final_summary
        )
        logger.info(f"Novo resumo salvo no cache para document_id: {document_id}")

        return final_summary
    except HTTPException as e:
        # Re-raise if it's an HTTP exception from the AI service (like timeout)
        raise e
    except Exception as e:
        logger.error(f"Erro inesperado na pipeline de resumo: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocorreu um erro interno inesperado ao gerar o resumo."
        )
