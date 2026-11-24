"""
Database Session & Engine Management
PostgreSQL 16+ (asyncpg with pgvector).
"""

import os
import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import text
from app.db.base import Base

try:
    from dotenv import load_dotenv
    env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
    load_dotenv(env_path)
except ImportError:
    pass

logger = logging.getLogger("app.db")

POSTGRES_DEFAULT_URL = "postgresql+asyncpg://postgres:postgrespassword@localhost:5432/all_india_tenders"

raw_db_url = os.environ.get("DATABASE_URL", "").strip()

def get_normalized_url(url: str) -> str:
    if not url or "sqlite" in url:
        return POSTGRES_DEFAULT_URL
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    if url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url

DATABASE_URL = get_normalized_url(raw_db_url)
IS_POSTGRES = True

# Engine options
engine_args = {
    "echo": False,
    "future": True,
    "pool_size": 20,
    "max_overflow": 10,
    "pool_recycle": 1800,
    "pool_pre_ping": True,
}

engine = create_async_engine(DATABASE_URL, **engine_args)
async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

async def init_db():
    """Initializes database schema and conditionally enables pgvector on PostgreSQL."""
    async with engine.begin() as conn:
        try:
            # Enable pgvector extension on PostgreSQL
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
            logger.info("[Database] pgvector extension ensured on PostgreSQL.")
        except Exception as e:
            logger.warning(f"[Database] Notice on pgvector extension: {e}")

        # Create all tables registered in Base metadata
        await conn.run_sync(Base.metadata.create_all)

        # Ensure user columns and sync quota state exist on cron_sync_logs
        try:
            await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN IF NOT EXISTS user_id VARCHAR(100)"))
            await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN IF NOT EXISTS user_email VARCHAR(255)"))
            await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN IF NOT EXISTS user_name VARCHAR(150)"))
            await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN IF NOT EXISTS sync_number INTEGER DEFAULT 1"))
            await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE"))
            await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN IF NOT EXISTS syncs_remaining INTEGER DEFAULT 1"))
            await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN IF NOT EXISTS next_sync_available_at TIMESTAMP WITH TIME ZONE"))
            await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN IF NOT EXISTS cooldown_until TIMESTAMP WITH TIME ZONE"))
            await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE"))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_cron_sync_logs_user_id ON cron_sync_logs (user_id)"))
            await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_cron_sync_logs_user_email ON cron_sync_logs (user_email)"))
        except Exception as col_err:
            logger.warning(f"[Database] Notice ensuring cron_sync_logs user columns: {col_err}")

        logger.info("[Database] Schema initialized successfully on PostgreSQL 16.")

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI Dependency for transactional database sessions."""
    async with async_session_factory() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
