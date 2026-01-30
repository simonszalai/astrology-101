---
description: Resolve review findings based on decisions. Implements fixes from review_todos, captures learnings.
skills:
  - research-knowledge-base
  - compound
---

# Resolve-Review Command

Work through review findings and implement accepted fixes.

## Usage

```
/resolve-review 009                              # Bug/incident #009 (NNN format)
/resolve-review F001                             # Feature F001 (FNNN format)
/resolve-review work_items/active/009-fix-timeout  # Use explicit path
```

## Prerequisites

- `review_todos/` exists with findings
- (Optional) User has filled Decision sections

## Process

1. **Read review_todos/** - identify pending items

2. **For each finding, check Decision section:**
   - If Action is empty, missing, or "accept" → execute the **Suggested Fix** as-is
   - If Action is "skip" → document reasoning and mark status: skipped
   - If Action is "modify" → follow the user's notes for the modified approach

3. **For each accepted/default finding:**
   - Implement the suggested fix exactly as written
   - Update Resolution Notes section
   - Mark status: resolved

4. **For skipped findings:**
   - Document reasoning in Resolution Notes
   - Mark status: skipped

5. **Capture learnings:**
   - Search `.claude/knowledge/` for existing docs on the topic (avoid duplicates)
   - Run `/compound` for significant fixes worth documenting
   - Document gotchas, patterns, solutions that aren't already captured

6. **Apply process improvement recommendations:**

   For each finding with Process Improvement Recommendations:

   **Plan Phase improvements:**
   - If recommendation is project-specific → create gotcha in `.claude/knowledge/gotchas/`
   - If recommendation is a general pattern → update `.claude/skills/plan-methodology/SKILL.md`
   - Examples: "Always research error handling patterns before planning async routes"

   **Build Todos Phase improvements:**
   - If recommendation adds a research step → update `.claude/skills/build-plan-methodology/SKILL.md`
   - If recommendation references useful patterns → add to `.claude/knowledge/references/`
   - Examples: "Search for similar React components before defining new ones"

   **Build Phase improvements:**
   - If recommendation adds a verification step → update `.claude/commands/build.md` checklist
   - If recommendation is about testing → add to `.claude/knowledge/gotchas/` for test patterns
   - Examples: "Run full build and typecheck before marking complete"

   **Where to apply:**

   | Recommendation Type             | Target Location                                  |
   | ------------------------------- | ------------------------------------------------ |
   | Project-specific pitfall        | `.claude/knowledge/gotchas/[topic]-YYYYMMDD.md`  |
   | Reusable pattern                | `.claude/knowledge/references/[topic]-YYYYMMDD.md` |
   | Plan research requirement       | `.claude/skills/plan-methodology/SKILL.md`       |
   | Build todo research requirement | `.claude/skills/build-plan-methodology/SKILL.md` |
   | Build verification step         | `.claude/commands/build.md`                      |

   Use `/compound` to create knowledge docs with proper YAML frontmatter.

7. **Run typecheck:**
   - Run `npm run typecheck` - fix any type errors introduced by fixes
   - Run `npm run check` - ensure lint passes
   - Ensure clean build before completing

8. **Update plan.md** work log:

   ```
   | YYYY-MM-DD | resolve-review | Resolved N findings | X accepted, Y skipped |
   ```

9. **Commit changes:**

   ```bash
   # Stage all changes
   git add -A

   # Commit with standard message
   git commit -m "Resolve review findings for [work-item-id]: [summary]"

   # Push to remote
   git push
   ```

## Output

- Updated `review_todos/` with resolutions
- Code fixes for accepted findings
- Optional knowledge docs via `/compound`
- Process improvements applied to:
  - `.claude/skills/plan-methodology/SKILL.md` (plan research requirements)
  - `.claude/skills/build-plan-methodology/SKILL.md` (build todo research requirements)
  - `.claude/commands/build.md` (verification steps)
  - `.claude/knowledge/gotchas/` (project-specific pitfalls)
  - `.claude/knowledge/references/` (reusable patterns)
