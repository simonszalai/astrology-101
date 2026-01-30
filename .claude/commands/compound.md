---
description: Compound learnings into the knowledge system. Rules go to AGENTS.md, detailed docs to knowledge/.
---

# Compound Command

Capture learnings with intelligent routing between AGENTS.md (rules) and knowledge/ (detailed docs). Can also remove existing knowledge that proved incorrect or harmful.

## Usage

```
/compound                    # Interactive: analyzes recent context, adds or removes as needed
/compound rule               # Add a rule to AGENTS.md
/compound solution           # Add solution doc to knowledge/
/compound gotcha             # Add gotcha doc to knowledge/
/compound reference          # Add reference doc to knowledge/
/compound "topic or context" # Auto-detect: add, update, or remove
```

## Two-Tier Knowledge System

### Tier 1: AGENTS.md (Rules)

**Location:** `AGENTS.md` → "Compounded Rules" section

**Criteria - ALL must be true:**
- ✓ Applies to nearly every task (universal)
- ✓ Can be expressed concisely (≤10 lines)
- ✓ Is a "rule" or "always do this" pattern
- ✓ Failure to follow causes immediate problems
- ✓ Should be checked on every build/review

**Examples:**
- "Never add padding to CardContent - Card already has p-6"
- "Always use `~` import alias, never relative paths beyond parent"
- "Run `npm run check` before committing"

### Tier 2: knowledge/ (Detailed Docs)

**Location:** `.claude/knowledge/[type]/`

**Criteria - ANY makes it knowledge/:**
- → Specific to a feature or domain area
- → Needs detailed explanation (>10 lines)
- → Is background/context information
- → Only relevant when working on that specific area
- → Is a solved problem you might reference later

**Subdirectories:**
| Type      | Purpose                             | Location                           |
| --------- | ----------------------------------- | ---------------------------------- |
| solution  | Problem resolution, debugging steps | `.claude/knowledge/solutions/`     |
| gotcha    | Common pitfalls with full context   | `.claude/knowledge/gotchas/`       |
| reference | Architecture, patterns, guides      | `.claude/knowledge/references/`    |
| domain    | Business logic, terminology         | `.claude/knowledge/domain/`        |
| patterns  | Reusable code patterns              | `.claude/knowledge/patterns/`      |

## Discrimination Decision Tree

```
Did existing knowledge cause the problem?
├─ Yes → REMOVE: Delete the rule/doc that was wrong
│        (Search AGENTS.md and knowledge/ for the offending content)
└─ No  → Is this a correction or mistake I made?
         ├─ Yes → Could it be a ≤10 line rule?
         │        ├─ Yes → Does it apply to most tasks?
         │        │        ├─ Yes → ADD: AGENTS.md (rule)
         │        │        └─ No  → ADD: knowledge/gotchas/
         │        └─ No  → ADD: knowledge/solutions/
         └─ No  → Is it reference/context info?
                  ├─ Yes → ADD: knowledge/references/ or knowledge/domain/
                  └─ No  → ADD: knowledge/patterns/
```

## Process

### Step 1: Analyze Context

1. **Gather context:**
   - Review recent conversation for learnings
   - Identify the correction or insight
   - Check if existing knowledge caused the problem

2. **Apply discrimination criteria** - determine action:
   - **REMOVE** if existing knowledge was wrong/harmful
   - **ADD** if this is new learning

### Step 2: Execute Immediately

Do not ask for approval - just make the change.

**Removing content:**
- Search AGENTS.md for the problematic rule and delete it
- Search knowledge/ for the problematic doc and delete the file
- Show what was removed and why

**Adding to AGENTS.md:**
- Insert between the `<!-- COMPOUND:RULES:START -->` and `<!-- COMPOUND:RULES:END -->` markers
- Format as a clear, scannable rule with heading

**Adding to knowledge/:**
- Create with YAML frontmatter
- Use appropriate template

## Templates

### Rule (AGENTS.md)

```markdown
### [Short Title]

[1-10 line rule with clear do/don't guidance]

```tsx
// Example if helpful (keep brief)
```
```

### Solution (knowledge/)

```markdown
---
title: [Problem] Resolution
created: YYYY-MM-DD
tags: [area, technology]
---

# [Problem] Resolution

## Problem
[What went wrong]

## Root Cause
[Why it happened]

## Solution
[How it was fixed]

## Prevention
[How to avoid in future]
```

### Gotcha (knowledge/)

```markdown
---
title: [Pitfall Title]
created: YYYY-MM-DD
tags: [area, technology]
---

# [Pitfall Title]

## The Gotcha
[What catches people off guard]

## Why It Happens
[Underlying cause]

## The Fix
[How to handle it correctly]
```

### Reference (knowledge/)

```markdown
---
title: [Topic] Guide
created: YYYY-MM-DD
tags: [area, technology]
---

# [Topic] Guide

## Overview
[What this covers]

## [Sections as needed]
[Content]

## Examples
[Practical examples]
```

## Output

- Execute changes directly (add or remove)
- Show what was changed and why
