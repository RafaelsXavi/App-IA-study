
import logging
import io
import time
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.services import text_processor
from app.schemas.upload import PDFProcessResponse
from app.schemas.summary import SummaryRequest, SummaryResponse
from app.database import get_db

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post(
    "/upload-pdf/", 
    response_model=PDFProcessResponse, 
    tags=["Processamento de PDF"],
    summary="Processa um PDF para preparação de IA"
)
async def process_pdf_for_ai(file: UploadFile = File(..., description="Arquivo PDF a ser processado.")):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Formato de arquivo inválido. Por favor, envie um PDF."
        )
    logger.info(f"Recebido arquivo para processamento: {file.filename}")
    try:
        pdf_content = await file.read()
        pdf_stream = io.BytesIO(pdf_content)
        full_text = text_processor.extract_text_from_pdf(pdf_stream)
        if not full_text.strip():
             raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="O PDF parece estar vazio ou não contém texto extraível."
            )
        text_chunks = text_processor.chunk_text(full_text)
        logger.info(f"Arquivo {file.filename} processado. Total de chunks: {len(text_chunks)}")
        return PDFProcessResponse(filename=file.filename, total_chunks=len(text_chunks), chunks=text_chunks)
    except ValueError as e:
        logger.error(f"Erro de valor ao processar {file.filename}: {e}")
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except Exception as e:
        logger.error(f"Erro inesperado ao processar {file.filename}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Ocorreu um erro interno ao processar o arquivo.")
    finally:
        await file.close()

@router.post(
    "/generate-summary/",
    response_model=SummaryResponse,
    tags=["Geração de Conteúdo"],
    summary="Gera um resumo a partir de chunks de texto, com cache"
)
async def generate_summary(
    payload: SummaryRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Recebe chunks de texto e gera um resumo final coeso.

    Este endpoint utiliza um cache para evitar chamadas repetidas à IA e possui
    instrumentação para diagnóstico de performance e erros.
    """
    start_time = time.time()
    logger.info(f"Iniciando requisição para gerar resumo com {len(payload.chunks)} chunks.")

    # Guarda defensiva: não processar se não houver conteúdo.
    if not payload.chunks:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Não há conteúdo (chunks) para gerar um resumo."
        )

    try:
        final_summary = await text_processor.generate_summary_with_cache(
            db=db,
            chunks=payload.chunks,
            level=payload.level
        )
        return SummaryResponse(summary=final_summary)
    except HTTPException:
        # Re-levanta exceções HTTP já tratadas para que o FastAPI as retorne corretamente.
        raise
    except Exception as e:
        logger.error(f"Erro inesperado na pipeline de geração de resumo: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Ocorreu um erro interno inesperado ao gerar o resumo."
        )
    finally:
        duration = time.time() - start_time
        logger.info(f"Requisição de resumo finalizada em {duration:.2f} segundos.")
