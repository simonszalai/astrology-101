---
status: pending
source: [agent-name]
priority: p1 | p2 | p3
---

# Decision

**Action:** accept
**Notes:**

---

# [Finding Title]

## Finding

[What the review agent identified as an issue or improvement opportunity]

## Current Code

```tsx
// File: app/routes/example.tsx:NN-MM
[current code snippet]
```

## Suggested Fix

```tsx
// Proposed change
[suggested code]
```

## Files

| File                       | Lines | Issue               |
| -------------------------- | ----- | ------------------- |
| `app/routes/example.tsx`   | NN-MM | [brief description] |

## Impact

| Aspect          | Assessment                  |
| --------------- | --------------------------- |
| Complexity      | [reduces/increases/neutral] |
| Performance     | [improves/degrades/neutral] |
| Maintainability | [improves/degrades/neutral] |

## Process Improvement Recommendations

How to prevent similar issues in future work items:

### Plan Phase

**What the plan should have identified:**
[e.g., "Plan should have researched existing error handling patterns in similar routes"]

**Suggested addition to plan checklist:**
[e.g., "When planning database changes, verify existing Prisma patterns"]

### Build Todos Phase

**What research should have been done:**
[e.g., "Should have searched .claude/knowledge/gotchas/ for React patterns before implementation"]

**Suggested pattern to include:**
[e.g., "Build todo should reference similar implementations like app/routes/records.tsx"]

### Build Phase

**What verification was missing:**
[e.g., "Should have run full build and typecheck before marking complete"]

**Suggested check to add:**
[e.g., "Verify TypeScript types match Prisma schema"]

---

## Resolution Notes

[Filled during /resolve-review]

**Resolved:** YYYY-MM-DD
**Action taken:**

- [what was actually done based on decision]

**Learnings:**

- [anything worth documenting via compound]
