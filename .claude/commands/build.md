---
description: Execute an implementation plan. Works through build_todos step by step, writes code, updates work log.
---

# Build Command

Execute a plan by working through build_todos.

## Usage

```
/build 009                  # Execute bug #009 (NNN format)
/build F001                 # Execute feature F001 (FNNN format)
/build F001 --step 2        # Execute specific step
/build work_items/active/009-fix-timeout  # Use explicit path
```

## Process

1. **Verify ready:**
   - Read `plan.md` - understand the approach
   - List `build_todos/` - identify pending steps

2. **Process user feedback:**
   - Read `plan.md` Open Questions section - review all Q&A pairs
   - Read `plan.md` Additional Notes section - note any corrections or clarifications
   - If answers or notes require changes to build_todos:
     - Update affected todo files with new requirements
     - Add/remove/modify steps as indicated
     - Document changes in work log

3. **Execute each step:**
   - Read todo file → understand objective
   - Update status to `in_progress`
   - Implement changes as specified
   - Run type check: `npm run typecheck`
   - Run linting: `npm run check`
   - Update status to `complete`
   - Fill Completion Notes section
   - Add work log entry to `plan.md`

4. **Handle issues:**
   | Issue | Action |
   | --------------------- | ------------------------------- |
   | Missing info | Note in todo, continue or pause |
   | Tests failing | Debug, fix, document |
   | Approach doesn't work | May need `/refine-plan` |

5. **Final:**
   - Run full build: `npm run build`
   - Run typecheck: `npm run typecheck` - fix any type errors before completing
   - Add summary work log entry

## Status Flow

```
pending → in_progress → complete
                     → skipped (with reason)
```

## Work Log Entry Format

After each step, add to `plan.md`:

```markdown
| YYYY-MM-DD | build | Completed step NN: [title] | [result/notes] |
```

## Completion Notes

Fill in each completed build_todo (template in `plan-methodology/templates/build-todo.md`):

```markdown
## Completion Notes

**Completed:** YYYY-MM-DD
**Actual changes:**

- Modified `app/routes/records.tsx` lines 45-60
- Added component in `app/components/RecordCard.tsx`

**Issues encountered:**

- Had to adjust styling to match existing patterns
```
