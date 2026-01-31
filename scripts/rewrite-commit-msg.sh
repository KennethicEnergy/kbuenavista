#!/usr/bin/env bash
msg=$(cat)
first=$(echo "$msg" | head -n1)
rest=$(echo "$msg" | tail -n +2)
lower=$(echo "$first" | tr '[:upper:]' '[:lower:]')

# Already has conventional prefix
if echo "$first" | grep -qE "^(fix|docs|chore|feat):"; then
  echo "$msg"
  exit 0
fi

prefix="chore:"
# fix: typos, errors, issues, build, UI fixes
if echo "$lower" | grep -qE "fix |fix typings|fix theme|fix build|fix download|fix end date|fix transitions|fix issue|flickering|z-index|prevent scrolling|removed scrolling"; then prefix="fix:"; fi
# docs: readme, docs, demo
if echo "$lower" | grep -qE "readme|document|docs|demo image"; then prefix="docs:"; fi
# chore: refactor, remove, adjust, merge, revert, updated X
if echo "$lower" | grep -qE "refactor|remove |removed |adjusted |arranged|revert |decrement|merge branch|updated (theme|settings|timeline|description|project detail)|continue working|root colors"; then prefix="chore:"; fi
# feat: add, added, created, new feature
if echo "$lower" | grep -qE "^(add|added|created)|make .* dynamic|about page|loader|notification|not-found|firebase|theme settings|default colors|data-theme|new skills|new exp|project (images|gallery)|download resume|appstore|zustand"; then prefix="feat:"; fi

echo "${prefix} ${first}"
[ -n "$rest" ] && echo "$rest"
exit 0
