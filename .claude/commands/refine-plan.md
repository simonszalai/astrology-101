---
description: Iterate on an implementation plan based on feedback. Updates plan.md and build_todos.
---

# Refine-Plan Command

Iterate on a plan based on feedback or new information.

## Usage

```
/refine-plan 009                              # Bug/incident #009 (NNN format)
/refine-plan F001                             # Feature F001 (FNNN format)
/refine-plan F001 "Need to handle edge case X"  # Refine with feedback
/refine-plan work_items/active/009-fix-timeout  # Use explicit path
```

## What This Updates

- **plan.md** - Always updated (high-level architecture)
- **build_todos/** - Only if they exist (if `/create-build-todos` was already run)

## Process

1. **Read current state:**
   - `plan.md` - current architecture approach (including Feedback section)
   - `build_todos/` - current implementation steps (if exists)
   - Additional feedback from command argument (if provided)

2. **Spawn research agents** if needed:
   - Additional best practices research
   - Framework docs for new requirements
   - Codebase patterns for alternative approaches

3. **Update plan.md:**
   - Revise approach based on feedback
   - Update tradeoffs if changed
   - Add new side effects if identified
   - Add new risks if identified
   - Mark addressed feedback items with ✓ or [x]
   - Update work log with refinement entry

4. **Update build_todos/** (if they exist):
   - Add/remove/modify steps as needed
   - Renumber if order changes
   - Update discovered patterns if approach changed

5. **Capture corrections** to `knowledge/planning/`:
   - Document what changed and why
   - Help future planning avoid same issues

## When to Use

| Situation                   | Command               |
| --------------------------- | --------------------- |
| Iterate on architecture     | `/refine-plan`        |
| Create initial plan         | `/plan`               |
| Create implementation steps | `/create-build-todos` |

## Output

- Updated `plan.md`
- Updated `build_todos/` (if they existed)
- Optional planning corrections in `knowledge/`
