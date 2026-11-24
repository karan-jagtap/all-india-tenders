"""
High-Performance PostgreSQL Connection Pool (psycopg2 ThreadedConnectionPool)
Provides instantaneous, pooled thread-safe access to PostgreSQL 16 for all platform services.
"""

import os
import re
import logging
from contextlib import contextmanager
from typing import Generator
import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from psycopg2.extras import RealDictCursor

logger = logging.getLogger("app.db.postgres_pool")

def get_dsn() -> str:
    raw = os.environ.get("DATABASE_URL", "").strip()
    if not raw or raw.startswith("sqlite"):
        raw = "postgresql://postgres:postgrespassword@localhost:5432/all_india_tenders"
    if raw.startswith("postgresql+asyncpg://"):
        raw = raw.replace("postgresql+asyncpg://", "postgresql://", 1)
    return raw


_POOL: ThreadedConnectionPool = None

def get_pool() -> ThreadedConnectionPool:
    global _POOL
    if _POOL is None or _POOL.closed:
        dsn = get_dsn()
        logger.info(f"[PostgreSQL Pool] Initializing ThreadedConnectionPool (min=3, max=30)...")
        _POOL = ThreadedConnectionPool(minconn=3, maxconn=30, dsn=dsn)
    return _POOL


@contextmanager
def get_pg_cursor() -> Generator[RealDictCursor, None, None]:
    """Borrows a connection from the pool, yielding a RealDictCursor with auto-commit."""
    pool = get_pool()
    conn = pool.getconn()
    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        yield cur
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        pool.putconn(conn)


@contextmanager
def get_pg_connection():
    """Borrows a raw connection from the pool."""
    pool = get_pool()
    conn = pool.getconn()
    try:
        yield conn
    finally:
        pool.putconn(conn)


def is_postgres_available() -> bool:
    """Verifies that PostgreSQL 16 is live and accessible."""
    try:
        with get_pg_cursor() as cur:
            cur.execute("SELECT 1")
            return True
    except Exception as e:
        logger.warning(f"[PostgreSQL Pool] Connectivity check notice: {e}")
        return False
