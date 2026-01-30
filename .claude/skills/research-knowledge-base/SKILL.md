---
name: research-knowledge-base
description: Methodology for searching project knowledge base (references, gotchas, solutions). Portable to projects with knowledge/ folder.
---

# Knowledge Base Research Methodology

How to search and use a project's knowledge base for investigation.

## Knowledge Base Structure

```
knowledge/
├── references/    # Architecture, patterns, standards
├── gotchas/       # Known pitfalls and their solutions
└── solutions/     # Problem resolutions and fixes
```

## Search Patterns

**Find relevant references:**

```bash
# List all reference docs
ls knowledge/references/

# Search for topic in references
grep -r "topic" knowledge/references/
```

**Check for known gotchas:**

```bash
# List gotchas
ls knowledge/gotchas/

# Search gotchas for error pattern
grep -r "ErrorName" knowledge/gotchas/
```

**Find past solutions:**

```bash
# List solutions
ls knowledge/solutions/

# Search for similar problem
grep -r "keyword" knowledge/solutions/
```

## When to Use

**Before investigating:**

- Check if problem matches a known gotcha
- Look for past solutions to similar issues

**During investigation:**

- Reference architecture docs for context
- Check coding standards for expected patterns

**After finding root cause:**

- See if solution already documented
- Check gotchas for warnings about the fix

## Document Types

**References (`knowledge/references/`):**

- Architecture decisions
- Coding standards
- Deployment guides
- Pattern documentation

**Gotchas (`knowledge/gotchas/`):**

- Known pitfalls with specific technologies
- Edge cases that cause issues
- "Don't do X because Y" warnings

**Solutions (`knowledge/solutions/`):**

- Past problem resolutions
- Step-by-step fix documentation
- Workarounds and their rationale

## Output

When knowledge base findings are relevant:

```markdown
## Knowledge Base

**Relevant gotcha:** `knowledge/gotchas/connection-pooling.md`

- [Summary of gotcha and how it applies]

**Related solution:** `knowledge/solutions/oom-fix-20260110.md`

- [Summary of past fix and whether it applies]
```
