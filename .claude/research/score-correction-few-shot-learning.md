# Research: Score Correction UI for Few-Shot Learning

**Research Date:** 2025-01-25
**Topic:** User corrections for AI-generated scores and descriptions to create few-shot learning examples

---

## Executive Summary

The codebase has **partial infrastructure** for user corrections but **no UI** for making them. Key findings:

1. **Existing correction storage:** `x_posts.corrected_result` JSON field with `manual_override_at` timestamp
2. **Existing finetuning pipeline:** `impact_finetuning_data` + `impact_finetuning_runs` for OpenAI training
3. **No correction UI:** All scores displayed read-only; no edit buttons or correction modals
4. **Modal patterns available:** Split-panel layout (left list + right details) used in CitationsModal,
   ImpactAssessmentModal - ideal for original/corrected comparison
5. **Form components ready:** Textarea, Input, Select, Slider components; React Hook Form integration

---

## Current Score Architecture

### Score Types (9 total across 3 stages)

| Stage   | Score Field           | Explanation Field            | Threshold |
| ------- | --------------------- | ---------------------------- | --------- |
| Stage 0 | relevance_score       | relevance_explanation        | 40-60     |
| Stage 1 | freshness_score       | freshness_explanation        | 65        |
| Stage 1 | surprise_score        | surprise_explanation         | 50        |
| Stage 1 | materiality_score     | materiality_explanation      | 70        |
| Stage 1 | exposure_score        | exposure_explanation         | 50        |
| Stage 1 | impact_short_score    | impact_short_explanation     | varies    |
| Stage 1 | impact_long_score     | impact_long_explanation      | varies    |
| Stage 2 | positivity_score      | positivity_explanation       | -         |
| Stage 2 | downside_score        | downside_explanation         | -         |
| Stage 2 | timing_edge_score     | timing_edge_explanation      | -         |
| Stage 2 | market_reaction_score | market_reaction_explanation  | -         |
| Stage 2 | final_score           | (aggregated)                 | -         |

### Score Display Components

Located in `app/components/records/`:

- **ScorePill** - Color-coded badge (80+: green, 60-79: blue, 40-59: yellow, <40: red)
- **ScoreGroup** - Card with multiple pills + explanation panel
- **ScoreTabs** - Tab-style selector with scrollable explanation
- **ScoresSummaryBar** - Horizontal bar with final score + summary pills
- **SingleScoreCard** - Single metric display
- **PredictionCard** - Percentage display with ±formatting

All components are **read-only**. No edit/correct actions exist.

---

## Existing Correction Infrastructure

### Database Schema

```prisma
model x_posts {
  // ... other fields
  result             Json?       // Original AI result
  corrected_result   Json?       // User-corrected version
  manual_override_at DateTime?   // When correction was made
  // ...
}
```

This pattern only exists for `x_posts` - the main `record` and stage tables have no correction fields.

### Finetuning Data Model

```prisma
model impact_finetuning_data {
  id                     String
  impact_context         String   // Context for training
  impact_short           Int      // Short-term score (0-100)
  impact_short_reasoning String   // Explanation
  impact_long            Int      // Long-term score (0-100)
  impact_long_reasoning  String   // Explanation
  surprise               Int      // Surprise score
  surprise_reasoning     String   // Explanation
  ticker                 String?
  tweet_content          String?
  core_event             String?
  // ...
}
```

**Key insight:** The finetuning data model stores score + reasoning pairs, exactly what a correction
UI would produce.

---

## Existing Modal Patterns

### Split-Panel Layout (Recommended for Corrections)

**CitationsModal** (`app/components/records/CitationsModal.tsx:1-288`):
- Left: Scrollable list (380px width)
- Right: Detail panel
- Size: 70vw × 80vh
- Selection state managed with useState

**ImpactAssessmentModal** (`app/components/ticker/ImpactAssessmentModal.tsx:1-251`):
- Left: Revision list (w-64)
- Right: Scrollable details
- Size: 90vw × 90vh
- Shows "Original" vs subsequent revisions

### Edit Dialog Pattern

**RuleDialog** (`app/components/ticker/rules/RuleDialog.tsx:1-90`):
- Textarea for content editing
- Hidden intent field (create vs update)
- Cmd+Enter keyboard shortcut
- SaveButton/CancelButton actions

**EditAttributeModal** (`app/routes/(dashboard)/prompt-groups.tsx:71-114`):
- Single textarea for large text editing
- Callback-based save/cancel
- 12 rows minimum height

---

## Recommended UI Design

### Correction Modal Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Correct Score: Relevance                                           [×] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────┐   ┌─────────────────────────────────────┐  │
│  │     ORIGINAL (AI)       │   │        YOUR CORRECTION              │  │
│  ├─────────────────────────┤   ├─────────────────────────────────────┤  │
│  │                         │   │                                     │  │
│  │  Score: 72              │   │  Score: [  85  ] ←───────────────── │  │
│  │  ───────────────────    │   │         ▲ Slider or number input   │  │
│  │                         │   │                                     │  │
│  │  Explanation:           │   │  Explanation:                       │  │
│  │  ┌───────────────────┐  │   │  ┌─────────────────────────────────┐│  │
│  │  │ The filing shows  │  │   │  │                                 ││  │
│  │  │ moderate revenue  │  │   │  │ [Editable textarea with         ││  │
│  │  │ growth but the    │  │   │  │  pre-filled AI explanation]     ││  │
│  │  │ margin...         │  │   │  │                                 ││  │
│  │  └───────────────────┘  │   │  └─────────────────────────────────┘│  │
│  │                         │   │                                     │  │
│  │  (read-only)            │   │  ☐ Use as few-shot example          │  │
│  │                         │   │                                     │  │
│  └─────────────────────────┘   └─────────────────────────────────────┘  │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                          [Cancel]  [Save Correction]    │
└─────────────────────────────────────────────────────────────────────────┘
```

### Score Input Options

1. **Slider** - Visual 0-100 range (existing component: `app/components/ui/slider.tsx`)
2. **Number input** - Direct entry with min/max validation
3. **Hybrid** - Slider with number display that's also editable

### Trigger Points

Add "Correct" button to score display components:
- ScoreGroup card header (pencil icon)
- ScoreTabs individual tabs
- ScoresSummaryBar pills (on hover)

---

## Data Model Extension

### Option 1: Extend Stage Tables (Recommended)

Add correction fields to existing stage tables:

```prisma
model record_stage_1 {
  // ... existing fields

  // User corrections (nullable - null means no correction)
  corrected_surprise_score        Int?
  corrected_surprise_explanation  String?
  corrected_impact_short_score    Int?
  corrected_impact_short_explanation String?
  // ... etc for each score

  corrected_by                    String?    // User ID
  corrected_at                    DateTime?
}
```

**Pros:** Simple queries, existing foreign keys, no joins
**Cons:** Wide tables, many nullable columns

### Option 2: Separate Corrections Table

```prisma
model score_corrections {
  id              Int       @id @default(autoincrement())
  record_id       String    @db.VarChar
  stage           Int       // 0, 1, or 2
  score_type      String    // "relevance", "surprise", etc.
  original_score  Int
  corrected_score Int
  original_explanation  String
  corrected_explanation String
  corrected_by    String    // User ID
  corrected_at    DateTime  @default(now())
  use_for_training Boolean  @default(false)

  record          record    @relation(...)

  @@unique([record_id, score_type])
}
```

**Pros:** Cleaner schema, easy to query all corrections, training flag
**Cons:** Requires joins for display

### Option 3: JSON Blob (Existing Pattern)

Follow `x_posts.corrected_result` pattern:

```prisma
model record {
  // ... existing fields
  score_corrections Json?  // { "relevance": { score: 85, explanation: "..." }, ... }
  corrections_at    DateTime?
  corrections_by    String?
}
```

**Pros:** Flexible, single migration
**Cons:** No type safety, harder to query/aggregate

---

## Few-Shot Learning Integration

### Terminology Update

Replace "finetuning" with "few-shot learning" in UI:
- "Save as finetuning example" → "Use as example"
- "Training data" → "Few-shot examples"
- `impact_finetuning_data` table can remain (internal naming)

### Example Storage Flow

1. User corrects score in modal
2. If "Use as example" checked:
   - Store in `prompt_examples` table with:
     - `flow_name`: "impact_assessment" (or relevant flow)
     - `task_name`: "eval_relevance" (or relevant task)
     - `prompt_type`: "few_shot_example"
     - `xml_content`: Formatted example with input/output
     - `record_id`: Link to source record
3. Examples retrieved at inference time via `getPromptExamplesForTasks()`

### Example Format (XML)

```xml
<example>
  <input>
    <content>SEC filing reveals Q3 revenue up 15% YoY...</content>
    <ticker>AAPL</ticker>
    <context>Earnings report during tech sector rally</context>
  </input>
  <output>
    <score>85</score>
    <explanation>Strong revenue growth significantly above analyst expectations indicates
    material positive impact. The timing during broader tech rally amplifies relevance.</explanation>
  </output>
</example>
```

---

## Implementation Checklist

### Phase 1: Database Schema
- [ ] Create migration for `score_corrections` table (Option 2)
- [ ] Add indexes for `record_id` and `score_type`
- [ ] Update Prisma schema and generate client

### Phase 2: UI Components
- [ ] Create `ScoreCorrectionModal` component
  - Split-panel layout (original left, correction right)
  - Score slider/input with validation (0-100)
  - Textarea for explanation (pre-filled with AI version)
  - "Use as example" checkbox
- [ ] Add "Correct" trigger button to `ScoreGroup` component
- [ ] Add "Correct" trigger button to `ScoreTabs` component

### Phase 3: API Routes
- [ ] Create `/resources/score-corrections` resource route
  - POST: Save correction
  - GET: Retrieve corrections for record
- [ ] Create `/resources/few-shot-examples` resource route
  - POST: Create example from correction
  - GET: List examples for task

### Phase 4: Integration
- [ ] Update score display components to show corrected values (with indicator)
- [ ] Add correction history panel (expandable)
- [ ] Wire few-shot examples to prompt assembly pipeline

---

## Files to Modify

### New Files
- `app/components/records/ScoreCorrectionModal.tsx`
- `app/routes/resources/score-corrections.tsx`
- `app/routes/resources/few-shot-examples.tsx`
- `app/models/scoreCorrections.server.ts`
- `prisma/migrations/YYYYMMDD_add_score_corrections/migration.sql`

### Modified Files
- `app/components/records/ScoreGroup.tsx` - Add correct button
- `app/components/records/ScoreTabs.tsx` - Add correct button
- `app/components/records/ScorePill.tsx` - Show corrected indicator
- `app/routes/records/$id.tsx` - Wire up correction modal
- `prisma/schema.prisma` - Add score_corrections model
- `app/models/promptExamples.server.ts` - Add createExampleFromCorrection()

---

## Coverage Statistics

| Zone       | Files Searched | Files with Matches | Pattern Hit Rate |
| ---------- | -------------- | ------------------ | ---------------- |
| Routes     | 26             | 10                 | 38%              |
| Components | 94             | 42                 | 45%              |
| Models     | 20             | 9                  | 45%              |
| Core       | 11             | 2                  | 18%              |
| Config     | 67             | 8                  | 12%              |
| **Total**  | **218**        | **71**             | **33%**          |

---

## References

- CitationsModal pattern: `app/components/records/CitationsModal.tsx`
- ImpactAssessmentModal pattern: `app/components/ticker/ImpactAssessmentModal.tsx`
- Score display: `app/components/records/ScoreGroup.tsx`, `ScoreTabs.tsx`, `ScorePill.tsx`
- Finetuning schema: `prisma/schema.prisma:228-269` (impact_finetuning_data/runs)
- Prompt examples: `app/models/promptExamples.server.ts`
- Existing corrections: `prisma/schema.prisma:878-903` (x_posts.corrected_result)
