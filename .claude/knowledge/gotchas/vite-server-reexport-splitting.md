---
title: Vite Server/Client Code Splitting with Re-exports
created: 2025-01-24
tags: [vite, react-router, bundling, code-splitting]
---

# Vite Server/Client Code Splitting with Re-exports

## The Gotcha

Re-exporting a **value** (constant, function) from a `.server.ts` file breaks client imports, even when:
- The value is defined in a shared (non-server) file
- The client imports from the shared file, not the server file

The bundler sees the re-export and associates the symbol with the server file.

## Error Message

```
[plugin:vite:import-analysis] Server-only module referenced by client

    '~/models/records.server' imported by 'app/components/MyComponent.tsx'

  See https://reactrouter.com/explanation/code-splitting#removal-of-server-code
```

## Why It Happens

Vite's React Router plugin traces all exports to determine what's server-only. When you re-export from a `.server.ts` file:

```tsx
// records.ts (shared)
export const GATE_THRESHOLDS = { freshness: 65 } as const

// records.server.ts
import { GATE_THRESHOLDS } from "./records"
export { GATE_THRESHOLDS }  // ❌ This "taints" the symbol
```

The bundler now considers `GATE_THRESHOLDS` as available from `records.server.ts`. When resolving imports, it may associate client imports with the server module, triggering the error.

## The Fix

**For values (constants, functions):**
- Export ONLY from non-`.server.ts` files
- Never re-export values from server files
- Import directly from the shared file in client code

```tsx
// records.ts (shared)
export const GATE_THRESHOLDS = { freshness: 65 } as const

// records.server.ts
import { GATE_THRESHOLDS } from "./records"
// Use internally, don't re-export

// MyComponent.tsx (client)
import { GATE_THRESHOLDS } from "~/models/records"  // ✅ Direct import
```

**For types:**
Type re-exports are safe because they're erased at compile time:

```tsx
// records.server.ts
import { type LlmStatData } from "./records"
export type { LlmStatData }  // ✅ OK - erased at compile time
```

## Quick Checklist

When adding shared constants/functions:

1. Define in a non-`.server.ts` file (e.g., `records.ts`)
2. Do NOT add to re-exports in corresponding `.server.ts` file
3. Add a comment in the shared file: `// NOTE: Do NOT re-export from .server.ts`
4. Client components import from the shared file directly
