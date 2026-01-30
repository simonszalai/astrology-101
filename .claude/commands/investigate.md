---
description: Investigate bugs and incidents to find root causes. NOT for new features.
---

# Investigate Command

Spawn investigator agents to diagnose bugs and incidents. Focused on finding **root causes**
of problems, not designing solutions.

**For new features:** Skip this command and use `/plan` directly.

## Usage

```
/investigate "Page failing to load data"
/investigate work_items/active/009-fix-timeout
/investigate 009                              # Bug/incident #009 (NNN format)
```

## When to Use

| Situation                     | Use `/investigate`? | Instead Use             |
| ----------------------------- | ------------------- | ----------------------- |
| Bug: something is broken      | Yes                 | -                       |
| Incident: unexpected behavior | Yes                 | -                       |
| New feature                   | **No**              | `/plan` directly        |
| Understanding existing code   | **No**              | `/plan` (will research) |

## Naming Schemes

- **Bugs/Incidents**: `NNN-slug` (e.g., `009-layout-bug`)

## Work Item Setup

**If work item path given:** Use that folder for `investigation.md`

**If starts with `F` followed by digits** (e.g., `F001`): **STOP**

Features should NOT use `/investigate`. Tell the user:

> "Features don't need investigation - use `/plan F001` directly to create an architecture plan."

**If starts with a number only** (e.g., `009`): Search for bug/incident

1. Extract the leading number (e.g., "009" from "009 check timeout settings")
2. Search: `find work_items -maxdepth 2 -type d -name "NNN-*"` (exclude `FNNN` patterns)
3. If found in **backlog/**: Move to **active/** first
4. If found in **active/** or **closed/**: Use that folder directly
5. If not found: create a new bug work item

**If no work item (prompt only):** Create new bug/incident folder:

1. Search active/closed for existing bugs: `find work_items/{active,closed} -maxdepth 1 -type d -name "[0-9][0-9][0-9]-*"`
2. Extract the numeric prefix from each folder name (e.g., `001`, `009`, `027`)
3. Find the highest number, add 1
4. **Pad to 3 digits** (e.g., 3 → `003`, 42 → `042`, 100 → `100`)
5. Create folder: `work_items/active/NNN-slug/`

## Agent Selection

Choose agents based on problem symptoms:

| Symptoms                                  | Agent                   | Why                  |
| ----------------------------------------- | ----------------------- | -------------------- |
| connection, query, data, records, missing | `investigator-postgres` | Database state       |
| code, bug, why, pattern, history          | `researcher`            | Codebase & knowledge |

**Spawn only what's needed.** Most bugs need 1-2 agents.

**Can spawn multiple of same type** with different focus areas.

## Process

1. **Parse problem** - Identify symptoms and likely sources
2. **Select agents** - Pick relevant agents (often 1-2)
3. **Spawn in parallel** - Single message, multiple Task calls
4. **Collect findings** - Wait for all agents
5. **Synthesize** - Write `investigation.md` with root causes and evidence

## Examples

**"Missing data in database"**
→ `investigator-postgres` (data state) + `researcher` (code patterns)

**"Why is this bug happening?"**
→ `researcher` (code analysis) + `investigator-postgres` (if data-related)

**"Page not loading correctly"**
→ `researcher` (code patterns) to find the issue

## Output

Write `investigation.md` to work item folder with:

- Root causes identified
- Evidence from each source
- Severity assessment
- Recommended fixes (high-level)

The **solution design** happens in `/plan`, not here.
