---
title: Tailwind child selector doesn't work with React wrapper components
created: 2025-01-21
tags: [tailwind, react, css, alertdialog]
---

# Tailwind child selector doesn't work with React wrapper components

## The Gotcha

Using Tailwind's child selector `[&>*]:` to style direct children fails when React wrapper components like `AlertDialog`, `Tooltip`, or `Popover` are involved.

```tsx
// This does NOT work as expected
<div className="flex gap-3 [&>*]:min-w-24">
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <DeleteButton>Delete</DeleteButton>  {/* min-w-24 NOT applied */}
    </AlertDialogTrigger>
  </AlertDialog>
  <SaveButton>Save</SaveButton>  {/* min-w-24 applied */}
</div>
```

The `DeleteButton` won't get `min-w-24` because the direct child of the flex container is the `AlertDialog` component wrapper, not the button itself.

## Why It Happens

The `[&>*]` selector targets direct DOM children. React components like `AlertDialog` render wrapper elements or use React portals, so the actual button is not a direct DOM child of the flex container.

The DOM structure ends up like:
```html
<div class="flex gap-3">
  <!-- AlertDialog renders something here, not directly the button -->
  <button>Save</button>
</div>
```

## The Fix

Apply styles directly to each button via `className` prop instead of using the child selector:

```tsx
// This works correctly
<div className="flex justify-end gap-3">
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <DeleteButton className="min-w-24">Delete</DeleteButton>
    </AlertDialogTrigger>
  </AlertDialog>
  <SaveButton className="min-w-24">Save</SaveButton>
</div>
```

This ensures the styles are applied regardless of wrapper component structure.
