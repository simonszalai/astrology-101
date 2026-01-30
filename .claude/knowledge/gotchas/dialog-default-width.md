---
title: Dialog Component Default Width Override
created: 2026-01-23
tags: [ui, dialog, shadcn, tailwind]
---

# Dialog Component Default Width Override

## The Gotcha

When passing custom width classes to `DialogContent` (e.g., `w-[70vw]`), the modal stays at a fixed small size instead of respecting the custom width.

## Why It Happens

The shadcn/ui Dialog component's base styles in `dialog.tsx` include:
```
w-full max-w-[calc(100%-2rem)] sm:max-w-lg
```

The `sm:max-w-lg` responsive variant overrides any custom `max-w-*` or `w-*` classes passed via className because:
1. Tailwind's responsive variants use media queries
2. When specificity is equal, CSS source order determines the winner
3. The base class comes before merged className classes

## The Fix

Remove the default width constraints from the DialogContent base styles:

```tsx
// Before
className={cn(
  "... w-full max-w-[calc(100%-2rem)] ... sm:max-w-lg",
  className,
)}

// After
className={cn(
  "... translate-x-[-50%] translate-y-[-50%] ...",
  className,
)}
```

Then each DialogContent usage must specify its own width:
```tsx
<DialogContent className="w-[70vw] max-w-[70vw] max-h-[85vh]">
```

## Alternative

If you can't modify the base component, use Tailwind's `!important` modifier:
```tsx
<DialogContent className="!w-[70vw] !max-w-[70vw]">
```
