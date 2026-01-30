---
title: Use fetcher.Form (not fetcher.submit) Inside Radix Dialog
created: 2025-01-25
tags: [react-router, radix, dialog, forms]
---

# Use fetcher.Form (not fetcher.submit) Inside Radix Dialog

## The Gotcha

When submitting forms inside a Radix Dialog, using a regular `<form>` with `onSubmit` and manual `fetcher.submit()` doesn't work - the form submission silently fails or causes unexpected behavior.

```tsx
// ❌ BROKEN - form submission fails silently in Dialog
<Dialog>
  <DialogContent>
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData()
      formData.set("intent", "update")
      fetcher.submit(formData, { method: "POST", action: "/api" })
    }}>
      <Button type="submit">Save</Button>
    </form>
  </DialogContent>
</Dialog>
```

## Why It Happens

Radix Dialog renders content in a React Portal (outside the normal DOM hierarchy). The manual `fetcher.submit()` approach can have issues with event handling and form context in portals.

## The Fix

Use `<fetcher.Form>` directly with hidden inputs for data:

```tsx
// ✅ CORRECT - works reliably in Dialog
<Dialog>
  <DialogContent>
    <fetcher.Form method="POST" action="/api">
      <input type="hidden" name="intent" value="update" />
      <input type="hidden" name="id" value={item.id} />
      <Input name="title" defaultValue={item.title} />
      <Button type="submit">Save</Button>
    </fetcher.Form>
  </DialogContent>
</Dialog>
```

## Pattern for Close-on-Success

Use `prevFetcherState` ref to detect when submission completes:

```tsx
const fetcher = useFetcher()
const prevFetcherState = useRef(fetcher.state)

useEffect(() => {
  if (prevFetcherState.current !== "idle" && fetcher.state === "idle" && open) {
    if (fetcher.data?.success) {
      onOpenChange(false)
    }
  }
  prevFetcherState.current = fetcher.state
}, [fetcher.state, fetcher.data, open, onOpenChange])
```

## Reference Implementation

See `app/components/ticker/rules/RuleDialog.tsx` for a working example.
