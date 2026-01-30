---
title: Duplicate Route Files (api.* vs resources.*)
created: 2026-01-21
tags: [routes, react-router]
---

# Duplicate Route Files (api.* vs resources.*)

## The Gotcha

Creating both `api.[resource].$param.ts` and `resources.[resource].$param.tsx` for the same
resource leads to duplicate code that's hard to maintain.

## Why It Happens

Unclear distinction between route types:
- `resources.*` routes are for internal fetchers (useFetcher)
- `api.*` routes were historically for external/JSON APIs

In React Router v7, `resources.*` routes can serve both purposes.

## The Fix

Use `resources.*` routes for internal fetchers. Only create `api.*` routes if you need:
- External API access (from other services)
- Different response format (pure JSON vs data())
- Different authentication requirements

Before creating a new route, search for existing routes:
```bash
ls app/routes/*ticker-rules* app/routes/*company-settings*
```

## Example

```tsx
// Use resources.* for internal fetchers
// File: app/routes/resources.ticker-rules.$ticker.tsx

export async function loader({ params }: Route.LoaderArgs) {
  const rules = await getRulesByTicker(params.ticker!)
  return { rules }
}

export async function action({ params, request }: Route.ActionArgs) {
  // Handle create/update/delete
}
```

Then in components:
```tsx
const fetcher = useFetcher()
fetcher.load(`/resources/ticker-rules/${ticker}`)
```
