---
title: ScrollArea in Flex Containers Needs min-h-0
created: 2026-01-23
tags: [ui, radix, flexbox, scrollarea]
---

# ScrollArea in Flex Containers Needs min-h-0

## The Gotcha

When using `<ScrollArea>` inside a flex container with `flex-1`, adding `h-full` prevents scrolling from working. Content gets cut off at the bottom instead of becoming scrollable.

```tsx
// ❌ Broken - content cut off, no scroll
<div className="flex-1 flex flex-col overflow-hidden">
  <ScrollArea className="flex-1 h-full">
    {/* Long content is cut off */}
  </ScrollArea>
</div>
```

## Why It Happens

In flexbox, `h-full` (height: 100%) tries to match the parent's full height, but this conflicts with flex sizing. The flex item can't shrink below its content size by default, so the ScrollArea expands to fit all content rather than constraining to available space and scrolling.

## The Fix

Use `min-h-0` instead of `h-full`. This allows the flex item to shrink below its content size, enabling the ScrollArea to constrain its height and scroll.

```tsx
// ✅ Works - content scrolls properly
<div className="flex-1 flex flex-col overflow-hidden">
  <ScrollArea className="flex-1 min-h-0">
    {/* Long content scrolls */}
  </ScrollArea>
</div>
```

## Key Points

- `flex-1` alone doesn't limit height in a flex column
- `min-h-0` overrides the default `min-height: auto` that prevents shrinking
- Parent containers in the flex chain also need `overflow-hidden` or `min-h-0`
