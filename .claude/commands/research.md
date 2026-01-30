---
description: Research how something is implemented across the entire codebase. Find patterns and inconsistencies.
---

# Research Command

Spawn multiple researcher agents to conduct **exhaustive** analysis of how something is implemented.
Focused on understanding patterns, finding inconsistencies, and documenting current state.

**For bugs:** Use `/investigate` instead.
**For new features:** Use `/plan` instead.

## Usage

```
/research "How is error handling done?"
/research "What patterns are used for data fetching?"
/research "How are forms validated across the app?"
/research "Find all uses of useEffect and check for missing deps"
```

## When to Use

| Situation                          | Use `/research`? | Instead Use    |
| ---------------------------------- | ---------------- | -------------- |
| Understanding implementation       | Yes              | -              |
| Finding patterns/inconsistencies   | Yes              | -              |
| Auditing code for specific pattern | Yes              | -              |
| Bug: something is broken           | **No**           | `/investigate` |
| New feature                        | **No**           | `/plan`        |

## Critical: Complete Coverage

**Every file must be searched.** This command spawns multiple agents in parallel, each assigned
a distinct portion of the codebase, to ensure nothing is missed.

## Partitioning Strategy

Divide the codebase into these non-overlapping zones:

| Zone       | Paths                                      | Agent Focus                    |
| ---------- | ------------------------------------------ | ------------------------------ |
| Routes     | `app/routes/**`                            | Route loaders, actions, pages  |
| Components | `app/components/**`                        | UI components, hooks usage     |
| Models     | `app/models/**`                            | Data access, Prisma patterns   |
| Core       | `app/lib/**`, `app/hooks/**`, `app/types/**` | Utilities, hooks, types      |
| Config     | Root config files, `prisma/`, `.claude/`   | Configuration patterns         |

**Spawn 4-5 agents in parallel**, one per zone. Each agent must:
1. Search EVERY file in their assigned zone
2. Document ALL occurrences of the pattern/topic
3. Note variations and inconsistencies
4. Return structured findings

## Agent Prompts

Each zone agent receives this structure:

```
Research topic: "{user's question}"

Your zone: {zone name}
Files to search: {glob pattern}

CRITICAL: You must search EVERY file in your zone. Do not sample or skip files.

For each file, document:
1. Whether the pattern/topic exists
2. How it's implemented (with code snippets)
3. Any variations from other files you've seen
4. Potential inconsistencies or issues

Return findings as structured markdown with:
- File-by-file breakdown
- Pattern summary for your zone
- Inconsistencies found
- Questions for synthesis
```

## Process

1. **Parse topic** - Understand what the user wants to research
2. **Partition codebase** - Assign zones to agents
3. **Spawn in parallel** - Single message, 4-5 Task calls with `subagent_type: Explore`
4. **Collect findings** - Wait for ALL agents to complete
5. **Synthesize** - Combine findings into `research.md`

## Synthesis

After all agents return, create `research.md` with:

1. **Executive Summary** - Key patterns found, main inconsistencies
2. **Zone-by-Zone Findings** - Detailed breakdown from each agent
3. **Pattern Catalog** - All variations discovered with examples
4. **Inconsistencies** - Problems found, ranked by severity
5. **Recommendations** - Suggested standardizations or fixes

## Output Location

Write `research.md` to:
- If work item provided: `work_items/active/{id}/research.md`
- If no work item: Output directly to user (don't create files)

## Examples

**"How is error handling done?"**
→ 5 agents search routes, components, models, core, config
→ Each documents try/catch patterns, error boundaries, toast usage
→ Synthesis reveals: routes use toast, components use ErrorBoundary, inconsistent in models

**"Find all useEffect hooks and check dependencies"**
→ Agents search all TSX files in their zones
→ Each lists every useEffect with its deps array
→ Synthesis flags: 12 potential missing deps, 3 empty dep arrays that should have values

**"What validation patterns are used?"**
→ Agents check Zod schemas, form validation, API validation
→ Synthesis: Zod in routes, no validation in 4 API endpoints, inconsistent error messages
