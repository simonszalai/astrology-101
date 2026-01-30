---
name: estimate-analysis
description: Risk identification and testing complexity analysis for AI-assisted development. Focuses on human time: review cycles, testing, and risk handling.
---

# Estimate Analysis Methodology

Standards for identifying risks, assessing testing complexity, and estimating human time in AI-assisted development.

## Core Principle: AI Builds, Humans Verify

**Claude Code with Opus 4.5 writes all code.** Implementation takes minutes, not hours.

Human time goes to:

1. **Plan review & iteration** - Reading AI plans, providing feedback, iterating
2. **Testing & verification** - Running tests, checking behavior, validating results
3. **Risk handling** - Dealing with unexpected issues, debugging, fixing

**Do NOT estimate time for:**

- Writing code (AI does this)
- Creating schemas, models, tests
- Refactoring or cleanup
- Documentation

## Prerequisites

**Estimation requires investigation.md.** Before running `/estimate`, ensure `/investigate` has been run.
Investigation provides root causes and recommended fixes to assess risk.

If investigation.md is missing, prompt: "Run `/investigate {id}` first to understand scope."

## Core Responsibilities

### 1. Risk Identification (PRIMARY FOCUS)

Identify items that could block or significantly slow work:

| Risk Type                    | Description                                    | Impact  |
| ---------------------------- | ---------------------------------------------- | ------- |
| Multi-system coordination    | Changes span multiple services/repos           | High    |
| Missing test infrastructure  | No way to test without manual setup            | Blocker |
| Data mocking requirements    | Need realistic test data that doesn't exist    | High    |
| External dependencies        | APIs, services, or people outside your control | High    |
| Unknown behavior             | Code paths without documentation or tests      | Medium  |
| Production-only verification | Can't test locally, must deploy to verify      | Medium  |
| Breaking changes             | Existing consumers will need updates           | High    |

**Risk assessment format:**

```markdown
## Risk Items

| Risk                           | Impact | Mitigation                          |
| ------------------------------ | ------ | ----------------------------------- |
| Stripe API mocking unavailable | High   | Create mock fixtures first          |
| Must coordinate with dashboard | High   | Sync with dashboard deploy          |
| No existing tests for module   | Medium | Add tests as part of implementation |

If no significant risks: "No blockers identified - fast iteration recommended."
```

### 2. Testing Complexity Assessment

Determine testing scenario and time impact:

| Testing Scenario             | Human Time  | Notes                              |
| ---------------------------- | ----------- | ---------------------------------- |
| Existing tests cover it      | ~5 min      | Just run and verify                |
| Need new unit tests          | ~15 min     | AI writes, human reviews output    |
| Need integration tests       | ~30 min     | May need setup, verify connections |
| Multi-system coordination    | 1-2 hrs     | Coordinate deploys, verify both    |
| Must mock external services  | 1-2 hrs     | Create fixtures, verify behavior   |
| Production-only verification | Variable    | Depends on deploy cycle            |
| No test infrastructure       | **BLOCKER** | Must build infra first             |

**Checklist format:**

```markdown
## Testing Complexity

- [x] Existing tests cover changes
- [ ] Need new unit tests (AI writes, human verifies)
- [ ] Need integration tests
- [ ] Multi-system coordination required
- [ ] Mock data needed: [specify what]
- [ ] Production-only verification required
- [ ] Missing test infrastructure (BLOCKER)
```

### 3. Iteration Cycle Estimation

Estimate plan review cycles based on complexity:

| Work Type          | Typical Cycles | Human Time |
| ------------------ | -------------- | ---------- |
| Simple/familiar    | 1 cycle        | ~15 min    |
| Medium complexity  | 2-3 cycles     | ~30-45 min |
| Complex/unfamiliar | 3-5 cycles     | ~1-2 hrs   |
| Novel architecture | 5+ cycles      | ~2-4 hrs   |

### 4. Criticality Determination

**Non-critical (default approach):**

- Move fast, ship, fix issues as they arise
- Minimal upfront estimation
- Time = deploy cycle + potential fix cycle
- Acceptable to fail and iterate

**Critical (thorough approach required when):**

- Data integrity at risk
- Financial transactions involved
- User-facing breaking changes
- Security implications
- Hard to rollback

**Format:**

```markdown
## Criticality

[Non-critical / Critical] - [reason]

**Recommended approach:**

- Non-critical: Ship and iterate. Fix issues as they surface.
- Critical: Full test coverage in staging before production.
```

## Output Format

```markdown
# Estimate: [Title]

## Criticality

[Non-critical / Critical] - [reason]

## Time Breakdown (Human Time Only)

| Phase                   | Time      | Notes                      |
| ----------------------- | --------- | -------------------------- |
| Plan review & iteration | X min     | [# cycles expected]        |
| Testing & verification  | X min     | [testing scenario]         |
| Risk buffer (if any)    | X min     | [only if risks identified] |
| **Total human time**    | **X min** |                            |

## Risk Items

| Risk     | Impact  | Mitigation      |
| -------- | ------- | --------------- |
| [Risk 1] | [H/M/L] | [how to handle] |

Or: "No significant risks identified - proceed with fast iteration."

## Testing Complexity

- [ ] Existing tests cover changes
- [ ] Need new unit tests (AI writes, human verifies)
- [ ] Need integration tests
- [ ] Multi-system coordination required
- [ ] Mock data needed: [specify]
- [ ] Production-only verification required
- [ ] Missing test infrastructure (BLOCKER)

## Investigation Reference

From investigation.md:

- **Root causes:** [list]
- **Recommended fixes:** [Priority 1, 2, etc.]

## Recommended Approach

[Non-critical: Ship and iterate. / Critical: Full staging verification.]
```

## Analysis Guidelines

- **Focus on risks, not implementation** - AI handles the code, you identify blockers
- **Default to fast iteration** - For non-critical work, shipping and fixing is faster than extensive planning
- **Flag blockers immediately** - Missing test infrastructure, external dependencies, multi-system coordination
- **Time estimates are human time only** - Plan review, testing, verification
- **Be specific about testing needs** - What mocks are needed? What coordination required?
