
import os
import google.generativeai as genai
import logging
import asyncio
from app.core.config import AI_REQUEST_TIMEOUT

# Configuração de logging
logger = logging.getLogger(__name__)

# Configuração da API do Google Gemini a partir de variáveis de ambiente
try:
    api_key = os.environ.get("API_KEY")
    if not api_key:
        raise ValueError("A variável de ambiente API_KEY não foi definida.")
    genai.configure(api_key=api_key)
except ValueError as e:
    logger.error(f"Erro na configuração da API Gemini: {e}")
    # A aplicação não poderá funcionar sem a chave, então podemos parar aqui ou ter um modo degradado.
    # Por simplicidade, vamos logar o erro. As chamadas falharão se a chave não for válida.

# Cache de modelo para evitar recriação em cada chamada
_model_instance = None

def get_model():
    """Retorna uma instância singleton do modelo generativo."""
    global _model_instance
    if _model_instance is None:
        logger.info("Inicializando o modelo Generative AI (gemini-1.5-flash-latest)...")
        _model_instance = genai.GenerativeModel('gemini-1.5-flash-latest')
    return _model_instance

async def call_google_ai_async(prompt: str, system_instruction: str) -> str:
    """
    Chama a API do Google Gemini de forma assíncrona com um prompt específico e timeout.
    """
    model = get_model()
    try:
        full_prompt = f"{system_instruction}\n\nTarefa:\n{prompt}"
        
        # Adiciona um timeout à chamada da API para evitar que a requisição fique pendurada
        response = await asyncio.wait_for(
            model.generate_content_async(full_prompt),
            timeout=AI_REQUEST_TIMEOUT
        )
        return response.text
    except asyncio.TimeoutError:
        logger.error(f"Timeout ({AI_REQUEST_TIMEOUT}s) ao chamar a API do Google Gemini.")
        # Propaga o erro para que a camada de serviço possa tratá-lo adequadamente
        raise
    except Exception as e:
        logger.error(f"Erro ao chamar a API do Google Gemini: {e}")
        # Retorna uma mensagem de erro genérica para o usuário
        return "Desculpe, não foi possível gerar o conteúdo no momento."
