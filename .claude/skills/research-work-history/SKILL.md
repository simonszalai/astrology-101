---
name: research-work-history
description: Work item history analysis for estimation calibration. Analyzes past risks, testing surprises, and iteration patterns.
---

# Work History Research Methodology

Standards for analyzing past work items to calibrate future estimates.

## Purpose

Past estimates show what actually took human time vs what didn't:

- What risks materialized vs what didn't
- Testing surprises (what was harder than expected)
- What could have been shipped faster with less planning
- Infrastructure gaps discovered during work

## Core Responsibilities

### 1. Past Estimate Discovery (PRIORITIZE ACTUALS)

Search for completed work items with estimates across all directories:

```bash
find work_items -name "estimate.md" -type f
```

This searches active/, backlog/, and closed/ folders.

**Priority order for usefulness:**

1. **Estimates with Notes fields** - Most valuable (explains what actually happened, learnings for future)
2. **Estimates with Variance Reason per subtask** - High value (shows per-task explanations)
3. **Estimates with Actual Hours only** - Medium value (shows planned vs actual, no context)
4. **Estimates without Actuals** - Lower value (no calibration data)

**Important:** Check `work_items/closed/` for recent work history and decisions. Closed work items contain:

- `source.md` - Original problem statement
- `investigation.md` - Analysis and findings
- `conclusion.md` - Final decisions and rationale
- `plan.md` - Implementation approach taken
- `estimate.md` - **Planned vs actual hours** (key calibration data)

For each estimate file, extract:

- Planned hours per subtask
- Actual hours (if filled in)
- **Variance Reason** column values (per-subtask explanations)
- **Notes** field content (overall learnings and context)
- Work item type (fix/feature)

### 2. Extract Learnings from Notes

Search for completed estimates with filled Notes fields:

```bash
grep -l "^\*\*Notes:\*\*" work_items/*/estimate.md work_items/*/*/estimate.md 2>/dev/null
```

The **Notes** field should contain:

- What risks materialized vs what didn't
- Testing surprises and infrastructure gaps
- What could have shipped faster

Extract patterns:

```markdown
## Risks That Materialized

| Pattern                     | Frequency | Example Work Item |
| --------------------------- | --------- | ----------------- |
| External API mocking needed | Common    | F001              |
| Multi-system coordination   | Sometimes | 009               |

## Things That Were Faster Than Expected

| Pattern                          | Frequency | Example Work Item |
| -------------------------------- | --------- | ----------------- |
| Could have shipped without tests | Often     | 007               |
| Plan review was overkill         | Sometimes | 008               |

## Infrastructure Gaps Found

| Gap                           | Work Item | Resolution       |
| ----------------------------- | --------- | ---------------- |
| No Stripe test fixtures       | F001      | Created mock     |
| No staging DB for integration | 009       | Added to backlog |
```

These learnings inform future risk identification.

### 3. Pattern Analysis

Identify what consistently takes human time:

```markdown
## Testing Complexity Patterns

| Work Type                | Typical Testing Time | Notes                 |
| ------------------------ | -------------------- | --------------------- |
| External API integration | 1-2 hrs              | Mock setup required   |
| Multi-system changes     | 2+ hrs               | Coordination overhead |
| Simple model changes     | ~15 min              | Existing tests cover  |

## Iteration Patterns

| Work Type          | Plan Cycles | Notes                      |
| ------------------ | ----------- | -------------------------- |
| Novel architecture | 4-5         | Expect multiple iterations |
| Familiar patterns  | 1-2         | Quick approval             |
```

### 4. Similar Work Search

Find similar past work by risk profile:

- **External dependencies**: Same APIs or services
- **Testing complexity**: Similar mock requirements
- **Multi-system scope**: Cross-repo changes

Search criteria:

```bash
grep -r "Multi-system" work_items/*/estimate.md work_items/*/*/estimate.md
grep -r "Mock data" work_items/*/estimate.md work_items/*/*/estimate.md
grep -r "BLOCKER" work_items/*/estimate.md work_items/*/*/estimate.md
```

### 5. Fast Iteration Analysis

Identify work that could have shipped faster:

- Non-critical items with extensive planning
- Work where risks didn't materialize
- Cases where "ship and fix" would have been better

## Output Format

```markdown
## Work History Analysis

### Similar Past Work

#### [Work Item Name]

- **Risks identified:** [what risks were flagged]
- **Risks materialized:** [what actually happened]
- **Testing time:** [actual testing complexity]
- **Key learning:** [from Notes field]

### Relevant Risk Patterns

From similar past work:

| Risk Type             | Frequency    | Typical Impact  |
| --------------------- | ------------ | --------------- |
| [Risk from past work] | [Often/Rare] | [What happened] |

### Testing Complexity Benchmarks

From similar work in this area:

| Scenario           | Typical Time | Notes     |
| ------------------ | ------------ | --------- |
| [Testing scenario] | [time]       | [context] |

### Fast Iteration Candidates

Past work that could have shipped faster:

- [Work item] - [why faster approach would have worked]

### Infrastructure Gaps to Watch

From past work:

- [Gap] - [how it was resolved or if still open]
```

## Analysis Guidelines

- Focus on **risk patterns**, not hour estimates
- Identify what slowed things down (testing, coordination, infrastructure)
- Note what was over-planned and could have shipped faster
- Flag infrastructure gaps that recur

## Key Insight

Historical data shows what risks are real vs theoretical. Use past experience to calibrate risk assessment, not to pad time estimates.
