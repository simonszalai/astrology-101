---
title: Duplicate Loading Spinners in Nested Routes
created: 2026-01-25
tags: [react-router, ui, navigation]
---

# Duplicate Loading Spinners in Nested Routes

## The Gotcha

When navigating between routes, you may see two spinners simultaneously if both a layout component and a page component implement their own loading indicators using `useNavigation()`.

## Why It Happens

React Router's `useNavigation()` hook returns the same global navigation state to all components. When `navigation.state === "loading"`:

1. The parent layout (e.g., `_app.tsx`) shows a full-page loading overlay
2. The child page (e.g., `ticker/index.tsx`) shows a local spinner on the clicked item

Both are valid uses of the hook, but they create redundant feedback.

## The Fix

Choose one loading indicator strategy:

**Option A: Global spinner only (recommended)**
- Keep the spinner in the layout (`_app.tsx`)
- Remove local spinners from individual pages
- Provides consistent UX across all navigation

**Option B: Local spinners only**
- Remove the global spinner from the layout
- Implement contextual spinners in each page
- Shows exactly what triggered the navigation

Don't mix both approaches for the same navigation event.
