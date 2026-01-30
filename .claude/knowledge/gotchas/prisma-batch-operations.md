---
title: Prisma Batch Operations Gotcha
created: 2026-01-22
tags: [prisma, performance, transactions]
---

# Prisma Batch Operations Gotcha

## The Gotcha

Prisma's `updateMany` and `deleteMany` don't return the affected records, only the count. If you need the updated data, you must query again.

## Why It Happens

Prisma follows PostgreSQL's behavior where `UPDATE ... RETURNING *` isn't exposed through `updateMany`. The `updateMany` method is optimized for bulk operations where you don't need the results.

## The Fix

Use a transaction to update and fetch atomically:

```typescript
// Need to update and return the result
const [updateResult, configs] = await db.$transaction([
  db.prompt_tag_configs.updateMany({
    where: { tag_key: tagKey },
    data: { attrs: newAttrs },
  }),
  db.prompt_tag_configs.findMany({
    where: { tag_key: tagKey },
    take: 1,
  }),
])

if (updateResult.count === 0) {
  throw new Error(`Not found: ${tagKey}`)
}

return configs[0]
```

## Alternative: Use `update` with Unique Constraint

If you have a unique constraint and need the result, use `update` directly:

```typescript
// If tag_key is unique, this works and returns the record
const updated = await db.prompt_tag_configs.update({
  where: { tag_key: tagKey },  // Must be @unique in schema
  data: { attrs: newAttrs },
})
```

But if the field isn't unique in the schema, you'll get a Prisma error.

## For Bulk Operations

When updating many records in a loop, always use transactions:

```typescript
// BAD: N round-trips
for (const item of items) {
  await db.table.update({ where: { id: item.id }, data: item.data })
}

// GOOD: 1 round-trip
const operations = items.map(item =>
  db.table.update({ where: { id: item.id }, data: item.data })
)
const results = await db.$transaction(operations)
```
