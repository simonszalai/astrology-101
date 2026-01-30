---
title: React Router .server.ts Module Boundaries
created: 2026-01-24
tags: react-router, vite, typescript, module-boundaries
---

# React Router .server.ts Module Boundaries

## The Gotcha

Client components cannot import anything from `.server.ts` files. Vite will fail with:

```
Server-only module referenced by client
'~/models/example.server' imported by 'app/components/Example.tsx'
```

This happens even if you're only importing a pure function or type that doesn't use any server code.

## Why It Happens

React Router (and Remix) use the `.server.ts` suffix as a convention to mark modules that should never be bundled for the client. Vite enforces this at build time - it doesn't analyze whether specific exports use server APIs, it blocks the entire import.

## The Fix

Extract shared types and pure functions to a non-server file:

```
app/models/
├── records.ts          # Shared types + pure functions (client-safe)
└── records.server.ts   # Server-only code (DB queries)
```

**Step 1: Create shared file (`records.ts`)**

```typescript
// app/models/records.ts
import type { recordsource } from "@prisma/client";

// Types can be shared
export interface RecordListItem {
  id: string;
  source: recordsource;
  // ...
}

// Pure functions can be shared
export function deriveStatus(data: unknown): string {
  // No DB access, no server APIs
  return "processed";
}
```

**Step 2: Import and re-export in server file**

```typescript
// app/models/records.server.ts
import { db } from "~/lib/db.server";

// Re-export shared items for server-side consumers
export { deriveStatus, type RecordListItem } from "./records";

// Server-only functions stay here
export async function getRecords() {
  return db.record.findMany();
}
```

**Step 3: Client components import from shared file**

```typescript
// app/components/RecordCard.tsx
import { deriveStatus, type RecordListItem } from "~/models/records";
//                                                    ^^^^^^^ no .server
```

## Prevention

When creating model files, ask: "Will any component need this type or function?"

- **Yes** → Put in `models/[name].ts` (shared)
- **No, only loaders/actions** → Put in `models/[name].server.ts`

Common candidates for shared files:

- TypeScript interfaces/types
- Enum definitions
- Pure utility functions (formatters, validators, derivers)
- Constants
