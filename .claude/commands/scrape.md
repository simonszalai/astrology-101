---
description: Add a new website to the scraper configuration.
---

# Scrape Command

Configure scraping for a new website.

## Usage

```
/scrape https://example.com/news
/scrape "Add Bloomberg for financial news"
```

## Process

1. **Analyze target site:**
   - Identify content structure
   - Find article/content selectors
   - Check for pagination

2. **Create scraper configuration:**
   - Site-specific selectors
   - Rate limiting settings
   - Content extraction rules

3. **Test scraper:**
   - Run against sample URLs
   - Verify content extraction
   - Check for edge cases

4. **Add to configuration:**
   - Update scraper registry
   - Add any required authentication

## Output

- Scraper configuration for the new site
- Test results showing successful extraction
