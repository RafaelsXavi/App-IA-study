
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import endpoints
from .database import init_db

# Configura o logging para o nível INFO para visibilidade em produção
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Instancia a aplicação FastAPI com metadados para documentação
app = FastAPI(
    title="Assistente de Estudos IA - Backend",
    description="API para processar materiais de estudo e gerar conteúdo educacional com IA.",
    version="1.0.0"
)

# Evento de startup para inicializar o banco de dados, se necessário
@app.on_event("startup")
async def on_startup():
    """Cria as tabelas do banco de dados na inicialização da aplicação."""
    logger.info("Iniciando a aplicação e preparando o banco de dados...")
    await init_db()
    logger.info("Banco de dados pronto.")

# Configuração do CORS (Cross-Origin Resource Sharing)
# Essencial para permitir que o frontend (hospedado em outro domínio) se comunique com esta API.
app.add_middleware(
    CORSMiddleware,
    # Em produção, para maior segurança, substitua "*" por uma lista de origens permitidas
    # ex: ["https://seu-frontend.onrender.com"]
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Inclui o roteador da API com um prefixo global /api/v1
app.include_router(endpoints.router, prefix="/api/v1")

@app.get("/", tags=["Health Check"], summary="Endpoint de verificação de saúde")
async def read_root():
    """Verifica se a API está online e operacional."""
    return {"status": "ok", "message": "Bem-vindo à API do Assistente de Estudos IA"}
