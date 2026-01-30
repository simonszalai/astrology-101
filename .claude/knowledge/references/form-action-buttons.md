---
title: Form Action Buttons Pattern
created: 2025-01-21
tags: [ui, buttons, forms, design-system]
---

# Form Action Buttons Pattern

## Overview

Reusable action button components for consistent form actions across the application. Located in `app/components/ui/action-buttons.tsx`.

## Components

| Component | Icon | Variant | Default Type | Use Case |
|-----------|------|---------|--------------|----------|
| `SaveButton` | Check | primary | submit | Saving/updating existing items |
| `CancelButton` | X | outline | button | Canceling/closing dialogs |
| `DeleteButton` | Trash | destructive | button | Delete operations |
| `CreateButton` | Plus (+) | primary | submit | Creating new items |

## Import

```tsx
import { SaveButton, CancelButton, DeleteButton, CreateButton } from "~/components/ui/action-buttons"
```

## Button Container Layout

Form action buttons must be:
- **Right-aligned** using `justify-end`
- **Consistent sizing** using `className="min-w-24"` on each button
- **Secondary/destructive button first** (left), **primary button last** (right)

### Standard Form Actions

```tsx
<div className="flex justify-end gap-3">
  <CancelButton className="min-w-24" onClick={() => history.back()} />
  <SaveButton className="min-w-24" isLoading={isSubmitting}>Save Changes</SaveButton>
</div>
```

### Create Form

```tsx
<div className="flex justify-end gap-3">
  <CancelButton className="min-w-24" onClick={() => history.back()} />
  <CreateButton className="min-w-24" isLoading={isSubmitting}>Create Item</CreateButton>
</div>
```

### Edit Form with Delete

```tsx
<div className="flex justify-end gap-3">
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <DeleteButton className="min-w-24">Delete</DeleteButton>
    </AlertDialogTrigger>
    {/* AlertDialog content */}
  </AlertDialog>
  <SaveButton className="min-w-24" isLoading={isSubmitting}>Save Changes</SaveButton>
</div>
```

## Dialog Buttons

In dialogs, use `DialogFooter` which handles alignment automatically. Use `size="sm"` for dialog buttons:

```tsx
<DialogFooter>
  <CancelButton size="sm" />
  <SaveButton size="sm" type="button" onClick={handleSave} />
</DialogFooter>
```

## Props

All action buttons support:

| Prop | Type | Description |
|------|------|-------------|
| `children` | ReactNode | Button label (has sensible defaults) |
| `isLoading` | boolean | Shows loading state with spinner text |
| `loadingText` | string | Text shown during loading (e.g., "Saving...") |
| `disabled` | boolean | Disables the button |
| `size` | "default" \| "sm" \| "lg" | Button size |
| `className` | string | Additional classes |
| `ref` | Ref | Forwarded ref for programmatic access |

## Examples

### Loading State

```tsx
<SaveButton isLoading={isSubmitting} loadingText="Saving...">
  Save
</SaveButton>
```

### With Ref (for keyboard shortcuts)

```tsx
const submitRef = useRef<HTMLButtonElement>(null)

<SaveButton ref={submitRef} size="sm" />

// Trigger programmatically
submitRef.current?.click()
```

### Override Type

```tsx
// Use type="button" when using onClick instead of form submission
<SaveButton type="button" onClick={handleSave} />
```
