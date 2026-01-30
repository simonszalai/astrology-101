---
name: plan-methodology
description: Planning process, input verification, and synthesis methodology. Used by planner agent.
---

# Plan Methodology

Standards for creating high-level architecture plans.

## Workflow by Work Type

| Work Type   | Input                        | Research Needed                     |
| ----------- | ---------------------------- | ----------------------------------- |
| **Feature** | source.md + user prompt      | Codebase patterns, existing code    |
| **Bug**     | source.md + investigation.md | Usually none (investigation has it) |

**For features:** Plan includes codebase research to understand existing patterns before designing.
**For bugs:** Plan uses investigation findings to design the fix.

## Output Template

Use the template at `templates/plan.md` for plan output.

**Formatting:** Limit lines to 100 chars (tables exempt). See AGENTS.md.

## What plan.md Contains

**Architecture-focused, NOT implementation-focused:**

- What we're building (high-level description)
- How it works (architectural approach)
- Why this approach (reasoning, alternatives)
- Tradeoffs (what we're optimizing for vs sacrificing)
- Side effects (what else this affects)
- Risks and mitigations
- Verification strategy (how to know it works)

**Does NOT contain:**

- Specific files to modify
- Code snippets or examples
- Line-by-line implementation details

Those details come in `build_todos/` via `/create-build-todos`.

## Plan Type Determination

Determine fix vs feature from input content:

**Fix indicators:**

- Keywords: fix, bug, error, broken, failing, issue, debug, crash, timeout
- Problem describes unexpected/incorrect behavior
- Investigation findings point to root cause

**Feature indicators:**

- Keywords: add, new, create, implement, build, feature, enhance, support
- Request describes new functionality
- No existing broken behavior to address

## Input Verification

Before planning, verify inputs are sufficient:

### For Features (FNNN)

| Required           | Check                                              | Source                |
| ------------------ | -------------------------------------------------- | --------------------- |
| Requirements       | Clear description of what to build                 | source.md             |
| Scope boundaries   | Know what's in/out of scope                        | source.md             |
| Integration points | Identified where feature connects to existing code | **Codebase research** |
| Patterns           | Found similar implementations to follow            | **Codebase research** |

**Process:** Spawn `researcher` agent to explore codebase patterns before planning.

### For Bugs (NNN)

| Required        | Check                                              | Source               |
| --------------- | -------------------------------------------------- | -------------------- |
| Problem clarity | Can articulate what's broken and expected behavior | source.md            |
| Root cause      | Investigation identified likely cause(s)           | **investigation.md** |
| Affected scope  | Know which files/components are involved           | **investigation.md** |
| Reproduction    | Understand when/how issue occurs                   | **investigation.md** |

**Process:** Read investigation.md. If missing or incomplete, suggest running `/investigate` first.

## Complexity Assessment

Assess implementation complexity to determine verification needs:

| Complexity | Criteria                                       | Verification Needed |
| ---------- | ---------------------------------------------- | ------------------- |
| Simple     | Single file change, obvious fix, <30 lines     | No (lint/types OK)  |
| Moderate   | 2-3 files, new logic, integrates with existing | Recommended         |
| Complex    | 4+ files, new components, changes data flow    | Required            |

**Simple examples:** typo fixes, config tweaks, adding logging, small bug fixes

**Complex examples:** new database schema changes, new API routes, multi-component features,
changes to data flow

## Planning Process

### For Features

1. **Read source.md** - Understand requirements and scope
2. **Research codebase** - Spawn `researcher` to find patterns, integration points
3. **Assess complexity** - Determine verification strategy needed
4. **Design architecture** - Choose high-level implementation approach
5. **Identify tradeoffs** - What we're optimizing for vs accepting
6. **Identify side effects** - What else this change affects
7. **Identify risks** - What could go wrong, how to mitigate
8. **Write plan.md** - Synthesize research into architecture doc

### For Bugs

1. **Read source.md + investigation.md** - Understand problem and root causes
2. **Verify investigation complete** - If missing root causes, suggest `/investigate`
3. **Assess complexity** - Determine verification strategy needed
4. **Design fix approach** - Choose solution based on root causes
5. **Identify tradeoffs** - What we're optimizing for vs accepting
6. **Identify side effects** - What else this fix affects
7. **Identify risks** - What could go wrong, how to mitigate
8. **Write plan.md** - Synthesize investigation into fix architecture

## Synthesis Guidelines

**Summary section:**

- 2-3 sentences max
- What we're building and why this approach

**What We're Building:**

- High-level description of the solution
- Answer: What will exist after this that doesn't exist now?
- NO code, NO file paths

**How It Works:**

- Architectural flow description
- How pieces fit together
- NO implementation details

**Research Findings (features) / Investigation Summary (bugs):**

For features:

- Existing patterns found in codebase
- Integration points identified
- Conventions to follow

For bugs:

- Root causes from investigation
- Affected components
- Evidence summary

**Tradeoffs section:**

- What we're optimizing for
- What we're accepting/sacrificing
- Alternatives considered and why rejected

**Side Effects section:**

- Other components affected
- Data/state changes
- Downstream impacts

**Risks:**

- What could go wrong
- Likelihood and impact
- Mitigation strategies

## Feature Checklist

When planning features, verify these infrastructure needs:

### Database Changes

- [ ] New tables or columns needed? → Include migration step
- [ ] New enum values? → Add to migration
- [ ] Seed data needed? → Include in migration or seed script

### API Keys / Environment

- [ ] New API keys required? → Document in deployment notes
- [ ] Environment variables needed? → Add to .env.example

## Folder Structure

```
work_items/
├── active/           # Currently being worked on
│   └── NNN-title/
├── backlog/          # Planned work not yet started
│   └── NNN-title/
└── closed/           # Completed work
    └── NNN-title/

Each work item contains:
  source.md           # INPUT: Problem/feature description (with frontmatter)
  estimate.md         # INPUT (optional): Subtask breakdown
  investigation.md    # INPUT (optional): From /investigate
  plan.md             # OUTPUT: High-level architecture plan
  build_todos/        # OUTPUT: From /create-build-todos (separate step)
```
