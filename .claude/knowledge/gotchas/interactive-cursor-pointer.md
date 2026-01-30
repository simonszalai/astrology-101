---
title: Interactive Elements Need cursor-pointer
created: 2025-01-23
tags: [ui, tailwind, accessibility]
---

# Interactive Elements Need cursor-pointer

## The Gotcha

Custom interactive elements don't automatically get pointer cursor in Tailwind CSS. Native `<button>` elements have default browser styling, but when you style them heavily or use divs/spans as clickable elements, the cursor remains as default.

## Why It Happens

Tailwind's reset (Preflight) normalizes button styles but doesn't enforce `cursor: pointer`. When buttons are styled with custom classes, the cursor behavior depends entirely on what you specify.

## The Fix

Always add `cursor-pointer` to:
- Modal/dialog close buttons
- Custom tab triggers
- Clickable card elements
- Any `<button>` with custom styling
- Divs/spans with `onClick` handlers

```tsx
// ✗ Missing cursor
<button className="px-3 py-1.5 rounded-md hover:bg-muted">
  Tab
</button>

// ✓ Explicit cursor
<button className="px-3 py-1.5 rounded-md hover:bg-muted cursor-pointer">
  Tab
</button>
```

## Components to Check

- Dialog close buttons (`DialogContent`)
- Tab triggers (`ScoreTabs`, `DisseminationDisplay`)
- Custom clickable cards
- Toolbar icon buttons
