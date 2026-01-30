# Research: Record Source Tracking and Display

**Topic:** Understanding where records come from and how source information is displayed
**Date:** 2026-01-27

---

## Executive Summary

Records in ts-dashboard track their origin through a **`source` enum** and **`source_meta` JSON field**.
Currently, source badges and author/domain info are displayed, but **no tooltips show the full source
metadata**. The UI lacks:

1. **Full source metadata tooltips** - Only author_username/domain shown, not full source_meta JSON
2. **Source filtering** - No way to filter records by source type in the list
3. **Detailed provenance** - No visibility into which X account, scraper config, or feed produced the record

---

## Current Source Tracking Architecture

### Database Schema

**File:** `prisma/schema.prisma:330-366`

```prisma
model record {
  id          String        @id
  source      recordsource  // Enum: X_POST, EMAIL, MANUAL_INPUT, DISCORD, ARTICLE, etc.
  source_meta Json?         // Flexible JSON for metadata
  posted_at   DateTime?     // When published at source
  fetched_at  DateTime?     // When ingested into system
}
```

### Source Enum Values

**File:** `prisma/schema.prisma:1235-1244`

| Enum Value          | Display Name   | Badge Color | Has Author | Has Domain |
|---------------------|----------------|-------------|------------|------------|
| `X_POST`            | X / X Post     | Blue        | ✓          | -          |
| `EMAIL`             | Email          | Emerald     | -          | -          |
| `MANUAL_INPUT`      | Manual         | Purple      | -          | -          |
| `DISCORD`           | Discord        | Indigo      | ✓          | -          |
| `ARTICLE`           | Article        | Amber       | -          | ✓          |
| `YOUTUBE_TRANSCRIPT`| YouTube        | Red         | -          | -          |
| `TRUTH_SOCIAL`      | Truth Social   | Rose        | ✓          | -          |
| `TICKER_SEARCH`     | Ticker Search  | Cyan        | -          | -          |

### Source Metadata Structure

The `source_meta` JSON field can contain:

```typescript
interface SourceMeta {
  author_username?: string  // For X_POST, DISCORD, TRUTH_SOCIAL
  author_id?: string        // Platform-specific user ID
  author_name?: string      // Display name
  domain?: string           // For ARTICLE sources
  // Potentially other fields not currently displayed
}
```

---

## Current Display Implementation

### Records List (RecordCard)

**File:** `app/components/records/RecordCard.tsx:147-182`

Currently displays:
- ✓ Source badge (color-coded)
- ✓ Author username (for social sources) with User icon
- ✓ Ticker symbol
- ✓ Posted timestamp
- ✗ **No source metadata tooltip**

```tsx
<Badge variant="outline" className={cn("text-[10px] px-1.5 py-0", getSourceColor(source))}>
  {formatSource(source)}
</Badge>
{authorUsername && (
  <span className="text-xs text-muted-foreground">
    <User className="h-3 w-3" />@{authorUsername}
  </span>
)}
```

### Record Detail Page (RecordHeader)

**File:** `app/components/records/RecordHeader.tsx:126-151`

Currently displays:
- ✓ Source badge (full name)
- ✓ Author OR domain (conditional based on source type)
- ✗ **No tooltip showing full source_meta**

```tsx
<span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px]">
  {formatSource(source)}
</span>
{showAuthor && <span><User />@{authorUsername}</span>}
{showDomain && <span><Globe />{domain}</span>}
```

### Content Column (Original Content Section)

**File:** `app/components/records/ContentColumn.tsx:248-268`

Displays source type with detail (author/domain) in the "Original Content" tab header.

---

## Data Available But Not Displayed

### 1. Full Source Metadata JSON

The `source_meta` field may contain more data than what's currently extracted:

```typescript
// Current extraction (limited)
sourceMeta: { author_username?: string } | null  // RecordListItem

// Full potential content
sourceMeta: {
  author_username?: string
  author_id?: string
  author_name?: string
  domain?: string
  // Other platform-specific fields
} | null
```

### 2. Related Tables Not Linked in UI

**Followed X Accounts** (`prisma/schema.prisma:214-228`)
- `followed_x_accounts.account_id` - Could show which followed account produced X_POST records
- `followed_x_accounts.priority_tier` - Could indicate account importance

**Scraper Runs** (`prisma/schema.prisma:527-547`)
- `scraper_runs.config_name` - Could show which scraper config produced ARTICLE records
- `scraper_runs.scraper_metadata` - Additional context about the scrape

### 3. Timestamps Not Shown

- `fetched_at` - When record was ingested (not shown, only `posted_at` displayed)

---

## Current Source Display Locations

| Location | Component | Source Badge | Author/Domain | Tooltip | Full Meta |
|----------|-----------|--------------|---------------|---------|-----------|
| Records List | RecordCard | ✓ Abbreviated | ✓ Username only | ✗ | ✗ |
| Record Header | RecordHeader | ✓ Full name | ✓ Username/Domain | ✗ | ✗ |
| Content Column | ContentColumn | ✓ In section title | ✓ As subtitle | ✗ | ✗ |

---

## Gaps Identified

### 1. No Source Metadata Tooltips

**Current:** Source badge shows type, author shown inline
**Missing:** Hover tooltip showing all available source_meta fields

**Recommendation:** Add tooltip to source badge showing:
- Source type (already shown)
- Author username + author_id
- Domain (if applicable)
- Posted timestamp
- Fetched timestamp
- Any additional source_meta fields

### 2. No Source Filtering in List

**Current:** Filter by time, outcome, score, search, alerted
**Missing:** Filter by source type

**Recommendation:** Add source filter dropdown with all recordsource enum values

### 3. No X Account Attribution

**Current:** Shows `@username` but no link to which followed account produced it
**Missing:** Connection between X_POST records and `followed_x_accounts`

**Recommendation:** For X_POST records, show which followed account (if any) the post came from

### 4. No Scraper Attribution for Articles

**Current:** Shows domain only
**Missing:** Which scraper config produced the article

**Recommendation:** For ARTICLE records, show scraper config name if available

---

## Relevant File Paths

### Data Layer
- `prisma/schema.prisma:330-366` - Record model with source fields
- `prisma/schema.prisma:1235-1244` - recordsource enum
- `app/models/records.ts:19-52` - RecordListItem interface
- `app/models/records.server.ts:491-525` - List item transformation

### UI Components
- `app/components/records/RecordCard.tsx:19-48` - formatSource, getSourceColor functions
- `app/components/records/RecordCard.tsx:147-182` - Source badge + author display
- `app/components/records/RecordHeader.tsx:35-51` - formatSource, sourceHasAuthor functions
- `app/components/records/RecordHeader.tsx:126-151` - Header source display
- `app/components/records/ContentColumn.tsx:55-81` - formatSourceLabel function

### Routes
- `app/routes/records/index.tsx` - Records list (no source filter)
- `app/routes/records/$id.tsx` - Record detail page

---

## Recommended Implementation

### Phase 1: Source Metadata Tooltips

1. **RecordCard** - Wrap source badge in Tooltip showing full source_meta
2. **RecordHeader** - Add tooltip to source badge with all metadata
3. **ContentColumn** - Add info icon with tooltip next to source label

### Phase 2: Source Filtering

1. Add `source` query parameter to records list route
2. Add source dropdown filter to UI (multi-select recommended)
3. Update `getRecordsList` to filter by source

### Phase 3: Enhanced Attribution (Optional)

1. Join X_POST records with `followed_x_accounts` to show account tier
2. Join ARTICLE records with `scraper_runs` to show config name
3. Display `fetched_at` alongside `posted_at` in tooltips

---

## Source Metadata Tooltip Design

Recommended tooltip content structure:

```
┌─────────────────────────────────────┐
│ X Post                              │
├─────────────────────────────────────┤
│ Author: @elonmusk (123456789)       │
│ Posted: Jan 25, 2026 at 2:30 PM     │
│ Fetched: Jan 25, 2026 at 2:31 PM    │
│ Account Tier: 1 (High Priority)     │
└─────────────────────────────────────┘
```

For articles:
```
┌─────────────────────────────────────┐
│ Article                             │
├─────────────────────────────────────┤
│ Domain: techcrunch.com              │
│ Published: Jan 25, 2026 at 2:30 PM  │
│ Fetched: Jan 25, 2026 at 2:31 PM    │
│ Scraper: tech-news-scraper          │
└─────────────────────────────────────┘
```
