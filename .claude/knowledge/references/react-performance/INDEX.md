# React Performance Best Practices

Comprehensive performance optimization guide for React applications, adapted from Vercel Engineering (January 2026). Next.js-specific patterns have been removed - these rules apply to React Router 7, Remix, and general React projects.

**Source:** [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/AGENTS.md)

## When to Use This Guide

| Agent Type | When to Reference |
|------------|-------------------|
| **Planning agents** | Before proposing async patterns, data fetching strategies, or component architecture |
| **Build agents** | When implementing data fetching, state management, or performance-sensitive code |
| **Review agents** | Check for waterfall patterns, unnecessary re-renders, bundle size issues |

## Sections by Priority

### CRITICAL Impact
- [Eliminating Waterfalls](./eliminating-waterfalls.md) - #1 performance killer. Async patterns, Promise.all, Suspense.
- [Bundle Size Optimization](./bundle-size.md) - Barrel imports, dynamic imports, preloading.

### MEDIUM-HIGH Impact
- [Client-Side Data Fetching](./client-side-fetching.md) - SWR, event listener deduplication, localStorage.

### MEDIUM Impact
- [Re-render Optimization](./re-render-optimization.md) - Derived state, memoization, functional setState.
- [Rendering Performance](./rendering-performance.md) - CSS content-visibility, SVG optimization, Suspense.

### LOW-MEDIUM Impact
- [JavaScript Performance](./javascript-performance.md) - Maps for lookups, array iteration, immutability.
- [Advanced Patterns](./advanced-patterns.md) - One-time init, useEffectEvent, stable refs.

## Quick Reference: Most Common Issues

### Waterfalls (check first!)
```typescript
// BAD: Sequential - 3 round trips
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()

// GOOD: Parallel - 1 round trip
const [user, posts, comments] = await Promise.all([
  fetchUser(), fetchPosts(), fetchComments()
])
```

### Barrel Imports (check second!)
```tsx
// BAD: Imports entire library (200-800ms)
import { Check, X } from 'lucide-react'

// GOOD: Direct imports (~2KB)
import Check from 'lucide-react/dist/esm/icons/check'
import X from 'lucide-react/dist/esm/icons/x'
```

### Re-renders from Closures
```tsx
// BAD: Stale closure, recreates callback
const addItem = useCallback((item) => {
  setItems([...items, item])
}, [items])

// GOOD: Functional update, stable callback
const addItem = useCallback((item) => {
  setItems(curr => [...curr, item])
}, [])
```

### Array Mutations
```tsx
// BAD: Mutates prop
const sorted = users.sort((a, b) => a.name.localeCompare(b.name))

// GOOD: Creates new array
const sorted = users.toSorted((a, b) => a.name.localeCompare(b.name))
```
