---
title: Ticker Stories List Page Pattern
created: 2025-01-25
tags: [tickers, stories, prisma, ui]
---

# Ticker Stories List Page Pattern

## Overview

The Ticker Stories page (`/ticker`) displays all Tier 1 and Tier 2 companies with their active story counts, organized in collapsible sections.

## Data Model

- `company_tiers` table stores tier assignments (tier 1 or 2) by ticker
- `ticker_stories` table has a `feed` enum: `MAIN`, `LOW_IMPACT`, `INACTIVE`, `DISABLED`
- Only `MAIN` feed stories count as "active"

## Query Pattern

```typescript
// In company.server.ts
export async function getTieredCompaniesWithStoryCounts() {
  // 1. Get tier 1 and 2 tickers
  const tieredTickers = await db.company_tiers.findMany({
    where: { tier: { in: [1, 2] } },
    select: { ticker: true, tier: true },
  })

  // 2. Get companies with MAIN story counts
  const companies = await db.companies.findMany({
    where: { ticker: { in: tickerList } },
    select: {
      ticker: true,
      company_name: true,
      _count: {
        select: { ticker_stories: { where: { feed: "MAIN" } } },
      },
    },
  })

  // 3. Merge and sort by tier, then story count desc
}
```

## UI Pattern

- Uses `flex h-full flex-col overflow-hidden` for proper scrolling
- Collapsible tier sections with Radix Collapsible component
- Shows company count and total stories in header
