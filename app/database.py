
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# Para simplicidade, usamos SQLite. Em produção, seria um banco de dados como PostgreSQL.
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite+aiosqlite:///./cache.db")

engine = create_async_engine(DATABASE_URL, connect_args={"check_same_thread": False})
AsyncSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine, class_=AsyncSession
)

Base = declarative_base()

async def get_db():
    """Dependência do FastAPI para injetar uma sessão de banco de dados assíncrona."""
    async with AsyncSessionLocal() as session:
        yield session

async def init_db():
    """Inicializa o banco de dados e cria as tabelas necessárias."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
