# Knowledge Base

Detailed documentation for agents to reference during planning and implementation.

## Directory Structure

```
knowledge/
├── solutions/    # Problem resolutions, debugging steps
├── gotchas/      # Common pitfalls with full context
├── references/   # Architecture, patterns, deployment guides
├── domain/       # Business logic, terminology
└── patterns/     # Reusable code patterns
```

## When to Use

**Planning agents:** Scan this directory before proposing implementations to leverage existing solutions and avoid known pitfalls.

**Build agents:** Reference relevant docs when implementing features in their domain.

**Review agents:** Check for pattern violations and known gotchas. Reference `react-performance/` for waterfall patterns, re-render issues, and bundle size problems.

## Adding Knowledge

Use `/compound` to add new knowledge. The command will:
1. Analyze the learning
2. Determine if it belongs here or in `AGENTS.md`
3. Propose content for approval
4. Write to the appropriate location

## Two-Tier System

| Tier | Location | Contains |
|------|----------|----------|
| 1 | `AGENTS.md` | Universal rules (≤10 lines, always apply) |
| 2 | `knowledge/` | Detailed docs (feature-specific, reference material) |

See `.claude/commands/compound.md` for discrimination criteria.
