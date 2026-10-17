#!/usr/bin/env bash
set -euo pipefail
# Safe STAGING ONLY for user's WSL; no production/main mutation.
SITE="/mnt/c/EurekaNexus/GitHub/eureka-website"
SRC="/mnt/c/EurekaNexus/EurekaNexus3_Cinematic_7Lang"
WT="/mnt/c/EurekaNexus/Eureka_AI_Website_3_Cinematic_Preview"
BRANCH="review/eureka-cinematic-v3-20261017"
EXPECTED="53b23a1217220564dd1ee6edd895120fc3d3f38f"
BACKUPS="$HOME/eureka-private-archive"

printf '\n=== EUREKA WEBSITE 3.0 — SAFE REVIEW STAGING ===\n'
test -f "$SRC/scripts/build_site.py"
test -f "$SRC/assets/site.js"
test "$(git -C "$SITE" branch --show-current)" = main
test -z "$(git -C "$SITE" status --porcelain)"
git -C "$SITE" fetch origin main
test "$(git -C "$SITE" rev-parse main)" = "$EXPECTED"
test "$(git -C "$SITE" rev-parse origin/main)" = "$EXPECTED"
test ! -e "$WT"
if git -C "$SITE" show-ref --verify --quiet "refs/heads/$BRANCH"; then echo 'ERROR=BRANCH_EXISTS'; exit 1; fi
if git -C "$SITE" ls-remote --exit-code origin "refs/heads/$BRANCH" >/dev/null; then echo 'ERROR=REMOTE_BRANCH_EXISTS'; exit 1; fi
python3 "$SRC/scripts/validate.py"
node --check "$SRC/assets/site.js"
python3 "$SRC/scripts/build_site.py"
python3 "$SRC/scripts/validate.py"
# Avoid unintended overwriting of authenticated media from the current site.
if test -s "$SITE/assets/media/manifest.json" && ! grep -Eq '^\[\s*\]$' "$SITE/assets/media/manifest.json"; then echo 'STOP=EXISTING_MEDIA_MANIFEST_REQUIRES_REVIEW'; exit 1; fi
umask 077
mkdir -p "$BACKUPS"
ST=$(date -u +%Y%m%dT%H%M%SZ)
BUNDLE="$BACKUPS/eureka-website-pre-v3-$ST.bundle"
git -C "$SITE" bundle create "$BUNDLE" --all
git -C "$SITE" bundle verify "$BUNDLE"
sha256sum "$BUNDLE" | tee "$BUNDLE.sha256"
echo 'BACKUP=PASS'
git -C "$SITE" worktree add -b "$BRANCH" "$WT" main
python3 - "$SRC" "$WT" <<'PY'
from pathlib import Path
import shutil,sys
src,dst=map(Path,sys.argv[1:])
assert src.is_dir() and dst.is_dir() and (dst/'.git').exists()
assert src.name=='EurekaNexus3_Cinematic_7Lang'
assert dst.name=='Eureka_AI_Website_3_Cinematic_Preview'
for entry in dst.iterdir():
 if entry.name=='.git': continue
 if entry.is_symlink() or entry.is_file():entry.unlink()
 elif entry.is_dir():shutil.rmtree(entry)
for entry in src.iterdir():
 if entry.name in ('__pycache__','.git'):continue
 if entry.is_dir():shutil.copytree(entry,dst/entry.name,ignore=shutil.ignore_patterns('__pycache__','*.pyc'))
 elif entry.is_file():shutil.copy2(entry,dst/entry.name)
PY
python3 "$WT/scripts/validate.py"
node --check "$WT/assets/site.js"
git -C "$WT" add -A
git -C "$WT" diff --cached --check
git -C "$WT" commit -m "feat(web): cinematic golden neural experience with seven languages"
git -C "$WT" push -u origin "$BRANCH"
test "$(git -C "$SITE" ls-remote origin refs/heads/main | awk '{print $1}')" = "$EXPECTED"
echo 'STAGING=PASS'
echo 'PUBLIC_WEBSITE=UNCHANGED'
echo "REVIEW_BRANCH=$BRANCH"
echo "PREVIEW_PATH=$WT"
echo "OPEN=https://github.com/Eureka-Nexus/eureka-website/compare/main...$BRANCH"
