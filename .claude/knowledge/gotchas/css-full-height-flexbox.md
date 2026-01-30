# CSS Full-Height Layouts with Flexbox

## The Problem

When creating full-height layouts (e.g., a two-column layout that fills the viewport), `h-full` (height: 100%) often doesn't work as expected. The element doesn't expand to fill available space.

## Root Cause

`height: 100%` only works if **every ancestor in the chain** has an explicit height. If any parent uses `min-height` instead of `height`, or has no height set, the chain breaks and `h-full` computes to `auto` (content height).

## Common Failures

### 1. Missing height on html/body

```tsx
// BROKEN - body has no height
<html>
  <body>
    <div className="h-full">  {/* Won't expand */}
```

**Fix:** Add `h-full` to both html and body:

```tsx
// root.tsx
<html lang="en" className="dark h-full">
  <body className="h-full">
```

### 2. Using min-h-svh instead of h-svh

```tsx
// BROKEN - min-height doesn't establish height for children
<div className="min-h-svh">
  <div className="h-full">  {/* Won't expand */}
```

**Fix:** Use `h-svh` for fixed viewport height:

```tsx
<div className="h-svh overflow-hidden">
  <div className="h-full">  {/* Now works */}
```

### 3. Flex children with h-full

```tsx
// BROKEN - flex-1 doesn't give explicit height
<div className="flex">
  <div className="flex-1">
    <div className="h-full">  {/* Won't expand */}
```

**Fix:** Either add `h-full` to flex child, or use `flex-1` all the way down:

```tsx
// Option A: Add h-full to flex child
<div className="flex h-svh">
  <div className="flex-1 h-full">
    <div className="h-full">  {/* Works */}

// Option B: Use flex-1 chain
<div className="flex h-svh">
  <div className="flex-1 flex flex-col">
    <div className="flex-1">  {/* Works */}
```

## The Correct Pattern for This Project

Full height chain for pages inside SidebarInset:

```
html          → h-full (100% of viewport)
body          → h-full (100% of html)
SidebarProvider wrapper → h-svh overflow-hidden (viewport height, prevents overflow)
SidebarInset  → flex-1 flex-col (fills remaining space after Sidebar)
Page content  → h-full (fills SidebarInset)
```

### Example Page Layout

```tsx
export default function MyPage() {
  return (
    <div className="flex h-full">
      {/* Left panel - 2/3 width */}
      <div className="w-2/3 flex flex-col min-h-0 border-r">
        <div className="p-4 border-b">Header</div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Scrollable content */}
        </div>
      </div>

      {/* Right panel - 1/3 width */}
      <div className="w-1/3 flex flex-col min-h-0">
        <div className="p-4 border-b">Header</div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Scrollable content */}
        </div>
      </div>
    </div>
  );
}
```

## Key Classes

| Class | Purpose |
|-------|---------|
| `h-full` | 100% of parent height (requires parent to have explicit height) |
| `h-svh` | 100svh - viewport height (doesn't need parent height) |
| `min-h-0` | Required on flex containers with scrolling children |
| `flex-1` | Grow to fill available space in flex container |
| `overflow-hidden` | Prevent content from expanding parent |
| `overflow-y-auto` | Enable vertical scrolling within container |

## Debugging Tips

1. **Check computed height** - If element has `height: auto`, the chain is broken
2. **Trace up the DOM** - Find which ancestor is missing explicit height
3. **Use h-svh as escape hatch** - When parent chain can't be fixed, use viewport units directly
4. **Add min-h-0 for scroll** - Flex items need this to allow children to scroll

## Files Modified for This Pattern

- `app/root.tsx` - Added `h-full` to html and body
- `app/components/ui/sidebar.tsx` - Changed wrapper from `min-h-svh` to `h-svh overflow-hidden`
- `app/routes/_app.tsx` - SidebarInset already has `flex-1 flex-col`
