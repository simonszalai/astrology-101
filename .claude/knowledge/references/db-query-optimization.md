---
title: Database Query Optimization Patterns
created: 2026-01-22
tags: [prisma, performance, database]
---

# Database Query Optimization Patterns

## Overview

Common performance issues in loaders and model functions, with solutions.

## N+1 Query Pattern

**Problem:** Fetching a list, then querying for each item.

```typescript
// BAD: N+1 queries
const groups = await getAllGroups()
const trees = await Promise.all(groups.map(g => getTreeForGroup(g.id)))
```

**Solution:** Create batch functions that fetch all data in one query.

```typescript
// GOOD: 2 queries total
const groupIds = groups.map(g => g.id)
const trees = await getTreesForGroups(groupIds)

// Implementation uses: WHERE id IN (groupIds)
export async function getTreesForGroups(ids: string[]): Promise<Record<string, Tree>> {
  const items = await db.table.findMany({
    where: { id: { in: ids } }
  })
  // Build lookup map
  return Object.fromEntries(items.map(i => [i.id, i]))
}
```

## Sequential Queries for Summary Data

**Problem:** Multiple queries that could run in parallel or be combined.

```typescript
// BAD: 4 round-trips
const totals = await db.$queryRaw`SELECT SUM(cost)...`
const topFlow = await db.$queryRaw`SELECT flow...LIMIT 1`
const topTask = await db.$queryRaw`SELECT task...LIMIT 1`
const topModel = await db.$queryRaw`SELECT model...`
```

**Solution:** Use CTEs to combine into single query.

```typescript
// GOOD: 1 round-trip
const result = await db.$queryRaw`
  WITH
    totals AS (SELECT SUM(cost) as total FROM llm_stat WHERE...),
    top_flow AS (SELECT flow, SUM(cost) as cost FROM llm_stat GROUP BY flow ORDER BY cost DESC LIMIT 1),
    top_task AS (SELECT task, SUM(cost) as cost FROM llm_stat GROUP BY task ORDER BY cost DESC LIMIT 1)
  SELECT
    t.total,
    f.flow as top_flow, f.cost as top_flow_cost,
    tk.task as top_task, tk.cost as top_task_cost
  FROM totals t
  LEFT JOIN top_flow f ON true
  LEFT JOIN top_task tk ON true
`
```

## Batch Mutations with Transactions

**Problem:** Loop with sequential updates.

```typescript
// BAD: N round-trips
for (const update of updates) {
  await db.table.updateMany({ where: {...}, data: {...} })
}
```

**Solution:** Use `db.$transaction()`.

```typescript
// GOOD: 1 round-trip (atomic)
const operations = updates.map(u =>
  db.table.updateMany({ where: { key: u.key }, data: u.data })
)
await db.$transaction(operations)
```

Also useful for related deletes:

```typescript
// Delete related records atomically
const [_, deleted] = await db.$transaction([
  db.child_table.deleteMany({ where: { parent_id: id } }),
  db.parent_table.delete({ where: { id } }),
])
```

## Avoid findFirst + update

**Problem:** Extra query to get ID before update.

```typescript
// BAD: 2 queries
const existing = await db.table.findFirst({ where: { key } })
if (!existing) throw new Error('Not found')
await db.table.update({ where: { id: existing.id }, data: {...} })
```

**Solution:** Use updateMany with the unique key, then fetch if needed.

```typescript
// GOOD: 1 transaction with 2 operations (still faster than 2 round-trips)
const [updateResult, configs] = await db.$transaction([
  db.table.updateMany({ where: { key }, data: {...} }),
  db.table.findMany({ where: { key }, take: 1 })
])

if (updateResult.count === 0) throw new Error('Not found')
return configs[0]
```

## DISTINCT ON for Latest-Per-Group

When you need the most recent record for each group:

```typescript
// BAD: N+1
const tasks = await getTaskNames()
const prompts = await Promise.all(tasks.map(t => getLatestPrompt(t)))
```

```typescript
// GOOD: Single query with DISTINCT ON
const prompts = await db.$queryRaw<Prompt[]>`
  SELECT DISTINCT ON (task_name)
    id, task_name, content, created_at
  FROM prompt_examples
  WHERE task_name = ANY(${taskNames})
  ORDER BY task_name, created_at DESC
`
```

## Identifying N+1 in Loaders

Look for these patterns in route loaders:

```typescript
// Red flags:
Promise.all(items.map(item => getSomethingFor(item.id)))
items.map(async item => await fetchRelated(item))
for (const item of items) { await loadDetails(item) }
```

Fix by creating batch versions of the underlying functions.
