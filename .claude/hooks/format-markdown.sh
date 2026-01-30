#!/bin/bash
set -e

# Read JSON from stdin and extract file path
file_path=$(jq -r '.tool_input.file_path // empty' 2>/dev/null)

# Only proceed if file_path exists and is a markdown file
if [[ -n "$file_path" && "$file_path" == *.md ]]; then
  npx prettier --write "$file_path"
fi

exit 0
