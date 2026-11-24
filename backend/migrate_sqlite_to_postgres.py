"""
High-Speed SQLite to PostgreSQL 16 Migration Pipeline
Migrates all relational taxonomy, contractors, 120,000 active tenders,
and 224,400 awarded historical contracts from SQLite into PostgreSQL via asyncpg copy_records_to_table.
"""

import os
import sys
import json
import time
import sqlite3
import asyncio
import asyncpg
from datetime import datetime, timezone

SQLITE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "app", "data", "all_india_tenders.db"))
PG_URL = os.environ.get("DATABASE_URL", "postgresql://postgres:postgrespassword@localhost:5432/all_india_tenders")

if PG_URL.startswith("postgresql+asyncpg://"):
    PG_URL = PG_URL.replace("postgresql+asyncpg://", "postgresql://", 1)


def parse_dt(val, target_type):
    if not val:
        return None
    dt = None
    if isinstance(val, datetime):
        dt = val
    else:
        try:
            val_clean = str(val).replace("Z", "+00:00")
            dt = datetime.fromisoformat(val_clean)
        except Exception:
            return None

    if "with time zone" in target_type:
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
    elif "without time zone" in target_type:
        if dt.tzinfo is not None:
            dt = dt.replace(tzinfo=None)
    return dt


async def migrate_table(pg_conn, sq_conn, table_name, json_cols=None, dt_cols=None, batch_size=20000):
    json_cols = json_cols or set()
    dt_cols = dt_cols or set()

    # Get PG columns
    pg_info = await pg_conn.fetch(f"""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '{table_name}' AND table_schema = 'public'
    """)
    pg_col_types = {r['column_name']: r['data_type'] for r in pg_info}
    if not pg_col_types:
        print(f"  [Skip] Table '{table_name}' does not exist in PostgreSQL.")
        return 0

    # Get SQLite columns
    sq_cursor = sq_conn.cursor()
    sq_cursor.execute(f"PRAGMA table_info({table_name})")
    sq_cols = [r[1] for r in sq_cursor.fetchall()]

    # Intersection of columns
    common_cols = [c for c in sq_cols if c in pg_col_types]
    if not common_cols:
        print(f"  [Skip] No common columns for table '{table_name}'.")
        return 0

    # Count rows in SQLite
    sq_cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
    total_rows = sq_cursor.fetchone()[0]
    if total_rows == 0:
        print(f"  [Empty] '{table_name}': 0 rows in SQLite.")
        return 0

    print(f"  --> Migrating '{table_name}': {total_rows:,} rows across {len(common_cols)} columns...")
    t0 = time.time()

    # Truncate PG table
    await pg_conn.execute(f"TRUNCATE TABLE {table_name} CASCADE")

    # Fetch and copy in batches
    col_str = ", ".join(f'"{c}"' for c in common_cols)
    sq_cursor.execute(f"SELECT {col_str} FROM {table_name}")

    copied_total = 0
    while True:
        rows = sq_cursor.fetchmany(batch_size)
        if not rows:
            break

        processed_rows = []
        for row in rows:
            p_row = []
            for idx, val in enumerate(row):
                col_name = common_cols[idx]
                col_type = pg_col_types[col_name]

                if val is None:
                    p_row.append(None)
                elif col_type in ('json', 'jsonb') or col_name in json_cols:
                    if isinstance(val, str):
                        # Ensure valid JSON string
                        try:
                            json.loads(val)
                            p_row.append(val)
                        except Exception:
                            p_row.append(json.dumps(val))
                    else:
                        p_row.append(json.dumps(val))
                elif 'timestamp' in col_type or 'date' in col_type or col_name in dt_cols:
                    p_row.append(parse_dt(val, col_type))
                elif col_type == 'boolean':
                    p_row.append(bool(val))
                elif col_type in ('double precision', 'real', 'numeric'):
                    try:
                        p_row.append(float(val))
                    except Exception:
                        p_row.append(0.0)
                elif col_type in ('integer', 'bigint', 'smallint'):
                    try:
                        p_row.append(int(val))
                    except Exception:
                        p_row.append(0)
                else:
                    p_row.append(str(val))
            processed_rows.append(tuple(p_row))

        await pg_conn.copy_records_to_table(
            table_name,
            records=processed_rows,
            columns=common_cols
        )
        copied_total += len(processed_rows)
        print(f"    Progress: {copied_total:,} / {total_rows:,} rows copied...")

    t1 = time.time()
    print(f"  [OK] '{table_name}': {copied_total:,} rows migrated in {t1 - t0:.2f}s ({copied_total / max(0.01, t1 - t0):,.0f} rows/s).")
    return copied_total


async def main():
    print(f"============================================================")
    print(f"SQLite to PostgreSQL 16 Migration")
    print(f"Source: {SQLITE_PATH}")
    print(f"Target: {PG_URL}")
    print(f"============================================================")

    if not os.path.exists(SQLITE_PATH):
        print(f"Error: SQLite DB not found at {SQLITE_PATH}")
        sys.exit(1)

    # 1. Initialize SQLAlchemy schema in PG
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))
    from app.db.base import Base
    from app.db.session import init_db, engine
    print("[1/3] Resetting & Initializing PostgreSQL schema & pgvector extension...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await init_db()

    # 2. Connect
    pg_conn = await asyncpg.connect(PG_URL)
    sq_conn = sqlite3.connect(SQLITE_PATH)

    # Disable constraints during bulk load
    print("[2/3] Bulk copying data...")
    tables_order = [
        ("states", set(), {"created_at", "updated_at"}),
        ("cities", {"aliases"}, {"created_at", "updated_at"}),
        ("sources", set(), {"created_at", "updated_at"}),
        ("portal_sources", {"key_authorities", "procurement_types"}, {"created_at", "updated_at"}),
        ("portal_state_mappings", set(), {"created_at", "updated_at"}),
        ("categories", {"keywords"}, {"created_at", "updated_at"}),
        ("organisations", set(), {"created_at", "updated_at"}),
        ("contractors", set(), {"created_at", "updated_at"}),
        ("contractor_pools", set(), {"created_at", "updated_at"}),
        ("contractor_contracts", set(), {"created_at", "updated_at"}),
        ("app_constants", {"data"}, {"created_at", "updated_at"}),
        ("feedback_submissions", set(), {"created_at", "updated_at"}),
        ("cron_sync_logs", set(), {"created_at", "updated_at", "next_sync_available_at", "cooldown_until", "completed_at"}),
        ("tenders", {"raw_data"}, {"created_at", "updated_at"}),
        ("awarded_tenders", {"raw_data"}, {"created_at", "updated_at"}),
    ]

    total_migrated = 0
    t_start = time.time()

    try:
        # Disable triggers for fast load
        for tbl, _, _ in tables_order:
            try:
                await pg_conn.execute(f"ALTER TABLE {tbl} DISABLE TRIGGER ALL")
            except Exception:
                pass

        for tbl, json_cols, dt_cols in tables_order:
            cnt = await migrate_table(pg_conn, sq_conn, tbl, json_cols, dt_cols)
            total_migrated += cnt

        # Re-enable triggers
        for tbl, _, _ in tables_order:
            try:
                await pg_conn.execute(f"ALTER TABLE {tbl} ENABLE TRIGGER ALL")
            except Exception:
                pass

    finally:
        await pg_conn.close()
        sq_conn.close()

    t_total = time.time() - t_start
    print(f"============================================================")
    print(f"[3/3] Migration Complete!")
    print(f"Total Rows Migrated: {total_migrated:,}")
    print(f"Total Time: {t_total:.2f}s ({total_migrated / max(0.01, t_total):,.0f} rows/s)")
    print(f"============================================================")


if __name__ == "__main__":
    asyncio.run(main())
