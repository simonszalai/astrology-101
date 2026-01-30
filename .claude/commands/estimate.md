---
description: Break down work into subtasks with time estimates. Searches past work items for similar tasks.
---

# Estimate Command

Create calibrated time estimates by analyzing risk factors, testing complexity, and iteration cycles.

## Core Philosophy: AI-Assisted Development

**Claude Code with Opus 4.5 builds the code.** Implementation takes minutes, not hours.

What actually takes human time:

1. **Plan review & iteration** - Reviewing AI-generated plans, providing feedback, iterating
2. **Testing & verification** - Running tests, checking behavior, validating in production
3. **Risk mitigation** - Handling unknowns, debugging unexpected issues

What does NOT need time estimates:

- Writing code (AI does this in minutes)
- Creating database schemas
- Writing tests
- Refactoring

**For non-critical items:** Move fast, let them fail, fix immediately. This is acceptable and often faster than extensive upfront planning.

## Prerequisites

**Run `/investigate` first.** Estimation depends on investigation findings to:

- Understand root causes and complexity
- Identify affected files and integration points
- Use recommended fixes as basis for subtask breakdown

If `investigation.md` doesn't exist, prompt user to run `/investigate` first.

## Usage

```
/estimate 009                               # Bug/incident #009 (NNN format)
/estimate F001                              # Feature F001 (FNNN format)
/estimate work_items/backlog/F001-feature   # Use explicit path
```

## Agent Dispatch

Use the **work-estimator** agent which loads:

| Skill                 | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| estimate-analysis     | Risk identification, testing complexity, iteration cycles |
| research-work-history | Historical variance, past estimates with actuals          |

## Process

1. **Check prerequisites:**
   - Verify `investigation.md` exists in work item folder
   - If missing: "Run `/investigate {id}` first to understand scope before estimating."

2. **Understand scope from investigation:**
   - Read `investigation.md` for root causes and affected areas
   - Read `source.md` for original requirements
   - Use investigation's "Recommended Fixes" as subtask basis

3. **Identify risk items (PRIMARY FOCUS):**

   Risk items are things that could block or significantly slow down work:
   - **Multi-system coordination** - Changes spanning multiple services/repos
   - **Missing test infrastructure** - No way to test without manual setup
   - **Data mocking requirements** - Need realistic test data that doesn't exist
   - **External dependencies** - APIs, services, or people outside your control
   - **Unknown behavior** - Code paths without documentation or tests
   - **Production-only verification** - Can't test locally, must deploy to verify

4. **Assess testing complexity:**

   | Testing Scenario                 | Time Impact      |
   | -------------------------------- | ---------------- |
   | Existing tests cover it          | Minimal (~5 min) |
   | Need new unit tests              | Low (~15 min)    |
   | Need integration tests           | Medium (~30 min) |
   | Multi-system coordination needed | High (1-2 hrs)   |
   | Must mock external services      | High (1-2 hrs)   |
   | Production-only verification     | Variable         |
   | No test infrastructure exists    | Blocker - flag   |

5. **Estimate iteration cycles:**

   Plan review iterations (human reviews AI-generated plan):
   - Simple/familiar work: 1 cycle (~15 min)
   - Medium complexity: 2-3 cycles (~30-45 min)
   - Complex/unfamiliar: 3-5 cycles (~1-2 hrs)

6. **Determine approach based on criticality:**

   **Non-critical (default):** Move fast, deploy, fix issues as they arise
   - Minimal upfront estimation
   - Ship and iterate
   - Time = deploy cycle + fix cycle if needed

   **Critical:** Thorough planning and testing required
   - Full risk analysis
   - Comprehensive test coverage
   - Staging verification before production

7. **Create estimate.md:**

   ```markdown
   # Estimate: [Title]

   ## Criticality

   [Non-critical / Critical] - [reason]

   ## Time Breakdown

   | Phase                   | Time      | Notes                         |
   | ----------------------- | --------- | ----------------------------- |
   | Plan review & iteration | X min     | [# cycles expected]           |
   | Testing & verification  | X min     | [testing scenario from above] |
   | Risk buffer (if any)    | X min     | [only if risks identified]    |
   | **Total human time**    | **X min** |                               |

   **Notes:** [Context on actual time spent - what was learned, surprises]

   ## Risk Items

   | Risk     | Impact  | Mitigation      |
   | -------- | ------- | --------------- |
   | [Risk 1] | [H/M/L] | [how to handle] |
   | [Risk 2] | [H/M/L] | [how to handle] |

   If no risks: "No significant risks identified - proceed with fast iteration."

   ## Testing Complexity

   - [ ] Existing tests cover changes
   - [ ] Need new unit tests (AI writes, human verifies)
   - [ ] Need integration tests
   - [ ] Multi-system coordination required
   - [ ] Mock data needed (specify what)
   - [ ] Production-only verification required
   - [ ] Missing test infrastructure (BLOCKER)

   ## Recommended Approach

   **Non-critical:** Ship and iterate. Fix issues as they surface.

   OR

   **Critical:** Full test coverage in staging before production.

   ## Investigation Reference

   Based on `investigation.md`:

   - Root causes: [list from investigation]
   - Recommended fixes: [Priority 1, 2, etc.]
   ```

## Output

- `estimate.md` with risk assessment and testing complexity
- Focus on human time (review cycles, testing, risk handling)
- Clear criticality determination
- Recommended approach (fast iteration vs thorough planning)

## Post-Completion (CRITICAL for future calibration)

After work is done, **fill in actual time** - this calibrates future estimates:

```markdown
## Time Breakdown

| Phase                   | Planned    | Actual      | Notes                             |
| ----------------------- | ---------- | ----------- | --------------------------------- |
| Plan review & iteration | 30 min     | 15 min      | Plan was clear, minimal iteration |
| Testing & verification  | 45 min     | 90 min      | Had to mock external API          |
| Risk buffer             | 15 min     | -           | Not needed                        |
| **Total human time**    | **90 min** | **105 min** |                                   |

**Notes:** Testing took longer because we needed to mock the Stripe API
which wasn't in our test fixtures. For future payment-related work, check
mock availability first.
```

## Key Learnings to Capture

- What risks materialized vs what didn't
- Testing surprises (what was harder than expected)
- What could have been shipped faster
- Infrastructure gaps discovered
