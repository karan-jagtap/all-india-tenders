"""
Database Session & Engine Management
Supports PostgreSQL 16+ (asyncpg with pgvector) and local SQLite (aiosqlite) fallback.
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

# Default database URLs
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
os.makedirs(DATA_DIR, exist_ok=True)
SQLITE_DEFAULT_PATH = os.path.join(DATA_DIR, "all_india_tenders.db")
SQLITE_DEFAULT_URL = f"sqlite+aiosqlite:///{SQLITE_DEFAULT_PATH}"

raw_db_url = os.environ.get("DATABASE_URL", "").strip()

def get_normalized_url(url: str) -> str:
    if not url:
        return SQLITE_DEFAULT_URL
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    if url.startswith("postgresql://") and not url.startswith("postgresql+asyncpg://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if "sqlite" in url:
        # Guarantee absolute path so running commands from any working directory succeeds
        if "all_india_tenders.db" in url or "app/data" in url:
            return SQLITE_DEFAULT_URL
        if not url.startswith("sqlite+aiosqlite://"):
            return url.replace("sqlite://", "sqlite+aiosqlite://", 1)
    return url

DATABASE_URL = get_normalized_url(raw_db_url)
IS_POSTGRES = DATABASE_URL.startswith("postgresql")

# Engine options
engine_args = {
    "echo": False,
    "future": True,
}

if IS_POSTGRES:
    engine_args.update({
        "pool_size": 20,
        "max_overflow": 10,
        "pool_recycle": 1800,
        "pool_pre_ping": True,
    })
else:
    # SQLite connection settings
    engine_args.update({
        "connect_args": {"check_same_thread": False}
    })

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
        if IS_POSTGRES:
            try:
                # Enable pgvector extension if PostgreSQL is active
                await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
                logger.info("[Database] pgvector extension ensured on PostgreSQL.")
            except Exception as e:
                logger.warning(f"[Database] Notice on pgvector extension: {e}")

        # Create all tables registered in Base metadata
        await conn.run_sync(Base.metadata.create_all)

        # Ensure user columns and sync quota state exist on cron_sync_logs
        try:
            if IS_POSTGRES:
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
            else:
                # SQLite column migration check
                res = await conn.execute(text("PRAGMA table_info(cron_sync_logs)"))
                existing_cols = {row[1] for row in res.fetchall()}
                if "user_id" not in existing_cols:
                    await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN user_id VARCHAR(100)"))
                if "user_email" not in existing_cols:
                    await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN user_email VARCHAR(255)"))
                if "user_name" not in existing_cols:
                    await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN user_name VARCHAR(150)"))
                if "sync_number" not in existing_cols:
                    await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN sync_number INTEGER DEFAULT 1"))
                if "is_locked" not in existing_cols:
                    await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN is_locked BOOLEAN DEFAULT 0"))
                if "syncs_remaining" not in existing_cols:
                    await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN syncs_remaining INTEGER DEFAULT 1"))
                if "next_sync_available_at" not in existing_cols:
                    await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN next_sync_available_at DATETIME"))
                if "cooldown_until" not in existing_cols:
                    await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN cooldown_until DATETIME"))
                if "completed_at" not in existing_cols:
                    await conn.execute(text("ALTER TABLE cron_sync_logs ADD COLUMN completed_at DATETIME"))
                await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_cron_sync_logs_user_id ON cron_sync_logs (user_id)"))
                await conn.execute(text("CREATE INDEX IF NOT EXISTS ix_cron_sync_logs_user_email ON cron_sync_logs (user_email)"))
        except Exception as col_err:
            logger.warning(f"[Database] Notice ensuring cron_sync_logs user columns: {col_err}")

        logger.info(f"[Database] Schema initialized successfully on {'PostgreSQL' if IS_POSTGRES else 'SQLite'}.")

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
