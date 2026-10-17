#!/usr/bin/env bash
# Run inside WSL from the extracted Eureka website package.
# Creates review worktree/branch and pushes only that branch. Does NOT deploy production.
set -euo pipefail
PACKAGE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO="${EUREKA_WEBSITE_REPO:-/mnt/c/EurekaNexus/GitHub/eureka-website}"
WORKTREE="${EUREKA_WEBSITE_PREVIEW:-/mnt/c/EurekaNexus/Eureka_AI_Website_2_Bilingual_Preview}"
BRANCH="transition/eureka-ai-bilingual-20261016"
BACKUP_DIR="$HOME/eureka-private-archive"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
echo '=== EUREKA WEBSITE 2.1 — SAFE STAGING ==='
test -d "$REPO/.git"
test -f "$PACKAGE/index.html"
test -f "$PACKAGE/en/index.html"
test ! -e "$WORKTREE"
test -z "$(git -C "$REPO" status --porcelain)" || { echo 'ERROR: website main has uncommitted changes';exit 1; }
git -C "$REPO" fetch origin main
test "$(git -C "$REPO" rev-parse main)" = "$(git -C "$REPO" rev-parse origin/main)" || { echo 'ERROR: local main and origin/main differ'; exit 1; }
# Avoid replacing currently mounted active website branches.
if git -C "$REPO" show-ref --quiet --verify "refs/heads/$BRANCH";then echo "ERROR: branch already exists: $BRANCH"; exit 1;fi
umask 077
mkdir -p "$BACKUP_DIR"
BUNDLE="$BACKUP_DIR/eureka-website-before-bilingual-$TS.bundle"
git -C "$REPO" bundle create "$BUNDLE" --all
git -C "$REPO" bundle verify "$BUNDLE" >/dev/null
sha256sum "$BUNDLE"
python3 "$PACKAGE/scripts/validate.py"
echo "BACKUP=PASS $BUNDLE"
git -C "$REPO" worktree add -b "$BRANCH" "$WORKTREE" main
# Remove legacy content from NEW worktree branch only.
git -C "$WORKTREE" rm -rq -- .
# Package is self-contained. No .git directory is ever copied.
cp -a "$PACKAGE/." "$WORKTREE/"
python3 "$WORKTREE/scripts/validate.py"
if command -v node >/dev/null 2>&1; then
  node --check "$WORKTREE/assets/site.js"
  echo "JS_CHECK=PASS"
else
  echo "JS_CHECK=SKIPPED (node unavailable)"
fi
git -C "$WORKTREE" add -A
git -C "$WORKTREE" diff --cached --check
printf '\n=== CHANGE SUMMARY ===\n'
git -C "$WORKTREE" diff --cached --stat | tail -30
printf '\n=== COMMIT & PUSH REVIEW BRANCH ===\n'
git -C "$WORKTREE" commit -m 'feat(web): launch complete bilingual Eureka AI vision website'
git -C "$WORKTREE" push -u origin "$BRANCH"
echo 'STAGING=PASS'
echo 'PRODUCTION_UNCHANGED=YES'
echo "REVIEW_BRANCH=$BRANCH"
echo "PREVIEW_PATH=$WORKTREE"
echo 'OPEN: https://github.com/Eureka-Nexus/eureka-website/compare/main...transition/eureka-ai-bilingual-20261016?expand=1'
