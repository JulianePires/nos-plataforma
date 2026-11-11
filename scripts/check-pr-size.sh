#!/usr/bin/env bash
# 20-file limit per PR. Lockfiles, generated types, changesets, READMEs and control files do not count.
set -euo pipefail

BASE="${1:-origin/main}"
LIMIT=20

FILES=$( { git diff --name-only "$BASE"...HEAD; git diff --name-only --cached; git diff --name-only; git ls-files --others --exclude-standard; } \
  | sort -u \
  | grep -vE '(^|/)bun\.lock$|^packages/db/src/database\.types\.ts$|^\.changeset/|(^|/)README\.md$|^CLAUDE\.md$|^docs/context/INDEX\.md$|^\.claude/' || true)

COUNT=$(printf '%s\n' "$FILES" | sed '/^$/d' | wc -l | tr -d ' ')

echo "Changed files: $COUNT/$LIMIT"
if [ "$COUNT" -gt "$LIMIT" ]; then
  printf '%s\n' "$FILES"
  echo "PR exceeds the limit. Split the card." >&2
  exit 1
fi
