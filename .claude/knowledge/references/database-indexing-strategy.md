---
title: Database Indexing Strategy
created: 2026-01-22
tags: [postgresql, performance, database, prisma]
---

# Database Indexing Strategy

## Overview

Guidelines for adding indices based on query patterns in this codebase.

## When to Add Indices

### Always Index

1. **Foreign keys** - PostgreSQL doesn't auto-index FKs (unlike MySQL)
2. **Fields in WHERE clauses** - Especially if filtering large tables
3. **Fields in ORDER BY** - For pagination queries
4. **Fields in JOIN conditions**

### Consider Composite Indices For

1. **Pagination patterns**: `(status, updated_at)` for filtered + sorted queries
2. **Multi-column filters**: `(ticker, feed, updated_at)` for ticker story lookups
3. **Scheduling queries**: `(priority, next_due_time)` for job queues

## Index Patterns by Use Case

### Time-Range Filtering

```sql
-- For queries like: WHERE created_at >= $1 AND created_at <= $2
CREATE INDEX ix_llm_stat_created_at ON llm_stat(created_at);
```

### Pagination with Status Filter

```sql
-- For queries like: WHERE status = 'ACTIVE' ORDER BY updated_at DESC
CREATE INDEX ix_macro_stories_status_updated_at
  ON macro_stories(status, updated_at);
```

### Partial Indices (PostgreSQL)

For boolean flags where you mostly query one value:

```sql
-- Only index active companies (smaller, faster)
CREATE INDEX ix_companies_is_active
  ON companies(is_active)
  WHERE is_active = true;
```

### Processing Pipeline Indices

For stage-based processing where you query "ready for next stage":

```sql
CREATE INDEX ix_x_post_stage_0_next_stage_status
  ON x_post_stage_0(next_stage_status);
```

## Common Missing Indices in This Codebase

| Table | Column(s) | Query Pattern |
|-------|-----------|---------------|
| `llm_stat` | `created_at` | Time-range cost analysis |
| `record` | `posted_at` | Record listing/ordering |
| `macro_stories` | `(status, updated_at)` | Active story pagination |
| `ticker_stories` | `(ticker, feed, updated_at)` | Story listing |
| `followed_x_accounts` | `(priority_tier, next_due_time)` | Account scheduling |
| `record_alerts` | `(status, scheduled_time)` | Alert processing |
| `scheduled_alerts` | `(status, scheduled_time)` | Alert scheduling |

## Checking Index Usage

```sql
-- See which indices are being used
SELECT indexrelname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Find unused indices (candidates for removal)
SELECT indexrelname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan < 10
ORDER BY pg_relation_size(indexrelid) DESC;
```

## Checking for Duplicate Indices

Indices that are prefixes of other indices are often redundant:

```sql
-- Example: ix_table_col1 is redundant if ix_table_col1_col2 exists
-- The composite index can serve single-column queries on col1
```

Use `mcp__postgres__analyze_db_health` with `health_type: "index"` to find duplicates.

## Adding Indices in Alembic

```python
from alembic import op

def upgrade():
    # Simple index
    op.create_index(
        "ix_table_column",
        "table_name",
        ["column_name"],
        unique=False,
    )

    # Composite index
    op.create_index(
        "ix_table_col1_col2",
        "table_name",
        ["col1", "col2"],
        unique=False,
    )

    # Partial index (PostgreSQL)
    op.execute("""
        CREATE INDEX ix_table_partial
        ON table_name(column)
        WHERE condition = true
    """)

def downgrade():
    op.drop_index("ix_table_column", table_name="table_name")
```

## Performance Investigation Tools

1. **pg_stat_statements** - Find slow queries
2. **EXPLAIN ANALYZE** - Check query plans
3. **Postgres MCP tools**:
   - `analyze_db_health` - Index health, duplicates, bloat
   - `get_top_queries` - Slowest queries by time/resources
   - `explain_query` - Query plan analysis
