---
name: agent-browser-ui
description: Browser automation for ts-dashboard UI testing using agent-browser CLI. Used by verifier-local agent.
---

# agent-browser UI Testing

Use the `agent-browser` CLI for automated browser testing of ts-dashboard. This is the preferred
method for UI verification - **do NOT use Chrome MCP tools**.

## Prerequisites

- `agent-browser` installed: `npm install -g agent-browser`
- ts-dashboard running: `cd ../ts-dashboard && npm run dev`
- Local database has test data seeded

## Credentials (Development Only)

These are dev/test credentials, not sensitive:

```
Email: tssoftwareprojects@gmail.com
Password: tsdevpassword123
```

## Quick Start

```bash
# Start browser and login
agent-browser open http://localhost:5173
agent-browser wait 2000
agent-browser fill 'input[name="email"]' 'tssoftwareprojects@gmail.com'
agent-browser fill 'input[name="password"]' 'tsdevpassword123'
agent-browser click 'button[type="submit"]'
agent-browser wait 3000

# Navigate and verify
agent-browser open http://localhost:5173/macro-stories
agent-browser snapshot
agent-browser screenshot evidence.png
agent-browser close
```

## Command Reference

### Navigation

| Command                    | Description                    |
| -------------------------- | ------------------------------ |
| `open <url>`               | Navigate to URL                |
| `back`                     | Go back                        |
| `forward`                  | Go forward                     |
| `reload`                   | Reload page                    |

### Interaction

| Command                    | Description                    |
| -------------------------- | ------------------------------ |
| `click <selector>`         | Click element                  |
| `dblclick <selector>`      | Double-click element           |
| `type <selector> <text>`   | Type into element (append)     |
| `fill <selector> <text>`   | Clear and fill input           |
| `press <key>`              | Press key (Enter, Tab, etc.)   |
| `hover <selector>`         | Hover over element             |
| `check <selector>`         | Check checkbox                 |
| `uncheck <selector>`       | Uncheck checkbox               |
| `select <selector> <val>`  | Select dropdown option         |

### Waiting

| Command                    | Description                    |
| -------------------------- | ------------------------------ |
| `wait <ms>`                | Wait milliseconds              |
| `wait <selector>`          | Wait for element to appear     |

### Getting Information

| Command                    | Description                    |
| -------------------------- | ------------------------------ |
| `snapshot`                 | Get accessibility tree (AI)    |
| `screenshot [path]`        | Take screenshot                |
| `get text <selector>`      | Get element text               |
| `get html <selector>`      | Get element HTML               |
| `get value <selector>`     | Get input value                |
| `get count <selector>`     | Count matching elements        |
| `get title`                | Get page title                 |
| `get url`                  | Get current URL                |

### State Checks

| Command                    | Description                    |
| -------------------------- | ------------------------------ |
| `is visible <selector>`    | Check if element visible       |
| `is enabled <selector>`    | Check if element enabled       |
| `is checked <selector>`    | Check if checkbox checked      |

### Browser Control

| Command                    | Description                    |
| -------------------------- | ------------------------------ |
| `close`                    | Close browser                  |
| `set viewport <w> <h>`     | Set viewport size              |

## Selector Patterns

```bash
# By CSS selector
agent-browser click 'button[type="submit"]'
agent-browser click '#my-id'
agent-browser click '.my-class'

# By text content
agent-browser click 'text=Click Me'
agent-browser click 'button:has-text("Submit")'

# By role
agent-browser find role button click "Submit"

# By test ID
agent-browser click '[data-testid="submit-btn"]'

# Combining selectors
agent-browser click 'form button[type="submit"]'
```

## Common Verification Patterns

### Verify Page Loaded

```bash
agent-browser open http://localhost:5173/macro-stories
agent-browser wait 'h1'
agent-browser get text 'h1'
# Output: Macro Stories
```

### Verify List Has Items

```bash
agent-browser get count '[data-testid="story-card"]'
# Output: 3
```

### Verify Form Submission

```bash
agent-browser fill '#title' 'Test Title'
agent-browser fill '#description' 'Test Description'
agent-browser click 'button[type="submit"]'
agent-browser wait 2000
agent-browser is visible 'text=Saved successfully'
```

### Verify Delete With Confirmation

```bash
agent-browser click 'button:has-text("Delete")'
agent-browser wait 500
agent-browser is visible '[role="alertdialog"]'
agent-browser click 'button:has-text("Delete"):visible'
agent-browser wait 1000
agent-browser get url
# Should redirect to list page
```

### Capture Evidence

```bash
# Screenshot for report
agent-browser screenshot verification-evidence.png

# Accessibility snapshot for AI analysis
agent-browser snapshot > ui-snapshot.txt
```

## ts-dashboard Pages

| Page                     | URL                                    | Purpose                    |
| ------------------------ | -------------------------------------- | -------------------------- |
| Login                    | `/`                                    | Authentication             |
| Dashboard                | `/dashboard`                           | Overview                   |
| Tickers                  | `/tickers`                             | Ticker management          |
| Ticker Detail            | `/ticker/:symbol`                      | Individual ticker          |
| Macro Stories List       | `/macro-stories`                       | List all macro stories     |
| Macro Story Create       | `/macro-stories/create`                | Create new story           |
| Macro Story Detail       | `/macro-stories/:uuid`                 | View/edit story            |

## Troubleshooting

| Issue                    | Solution                               |
| ------------------------ | -------------------------------------- |
| `agent-browser not found`| `npm install -g agent-browser`         |
| Login fails              | Check dashboard is connected to DB     |
| Element not found        | Use `snapshot` to see available refs   |
| Timeout waiting          | Increase wait time, check selector     |
| Screenshot blank         | Wait for page load before screenshot   |

## Integration with Verification

In verification reports, include:

1. **Screenshots** as evidence of UI state
2. **Snapshot output** showing accessibility tree
3. **Command log** of actions taken
4. **Pass/Fail** for each UI check

Example report section:

```markdown
### UI Verification

| Page              | Check                     | Expected          | Actual | Status |
| ----------------- | ------------------------- | ----------------- | ------ | ------ |
| /macro-stories    | Page loads                | Shows list        | Yes    | PASS   |
| /macro-stories    | Stories visible           | Count > 0         | 3      | PASS   |
| /macro-stories/new| Form works                | Creates story     | Yes    | PASS   |
| Detail page       | Edit works                | Saves changes     | Yes    | PASS   |
| Detail page       | Delete confirms           | Shows dialog      | Yes    | PASS   |

Evidence: See `ui-verification.png`, `ui-snapshot.txt`
```
