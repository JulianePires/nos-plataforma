#!/usr/bin/env bash
# Acceptance tests for check-pr-size.sh (spec S0/01). Plain bash: no test framework dependency.
set -uo pipefail

SCRIPT="$(cd "$(dirname "$0")" && pwd)/check-pr-size.sh"
FAILURES=0

new_repo() {
  REPO=$(mktemp -d) || exit 1
  cd "$REPO" || exit 1
  git init -q -b main
  git config user.name test
  git config user.email test@example.com
  git config core.autocrlf false
  git config commit.gpgsign false
  git commit -q --allow-empty -m init
  git switch -q -c feature
}

add_files() {
  local count=$1 prefix=$2
  for i in $(seq 1 "$count"); do echo "$i" > "$prefix$i.txt"; done
}

run_check() {
  OUTPUT=$(bash "$SCRIPT" main 2>&1)
  STATUS=$?
}

expect() {
  local name=$1 want_status=$2 want_text=$3
  if [ "$STATUS" -eq "$want_status" ] && grep -qF "$want_text" <<<"$OUTPUT"; then
    echo "ok   - $name"
  else
    echo "FAIL - $name: status $STATUS (want $want_status), output: $(head -1 <<<"$OUTPUT")"
    FAILURES=$((FAILURES + 1))
  fi
  cd / && rm -rf "$REPO"
}

new_repo
add_files 21 f
git add -A && git commit -q -m files
run_check
expect "fails above the limit and lists the files" 1 "f21.txt"

new_repo
add_files 20 f
echo lock > bun.lock
git add -A && git commit -q -m files
run_check
expect "lockfile does not count" 0 "20/20"

new_repo
add_files 21 f
git add -A
run_check
expect "counts staged-only changes" 1 "21/20"

new_repo
add_files 1 f
git add -A && git commit -q -m files
echo changed > f1.txt && git add -A
run_check
expect "counts a committed and staged file once" 0 ": 1/20"

exit "$FAILURES"
