#!/bin/bash
# Deploy script.
# Versioning is owned by .githooks/post-commit -> scripts/version-bump.sh,
# which writes public/VERSION, public/js/version.js (APP_VERSION), and
# package.json. This script only handles cache-busting + SW bump + push + deploy.

set -e

VERSION=$(cat public/VERSION | tr -d ' \n')
echo "Deploying v$VERSION"

# Ensure public/js/version.js mirrors public/VERSION (in case it was edited manually).
echo "var APP_VERSION = \"$VERSION\";" > public/js/version.js

# Update HTML files that have hardcoded version placeholders
find public -name '*.html' -exec sed -i "s/v[0-9]\+\.[0-9]\+\.[0-9]\+/v$VERSION/g" {} +

# Cache bust all static resources
TS=$(date +%s)
find public -name '*.html' -exec sed -i "s/v=[0-9]\+/v=$TS/g" {} +

# Bump the service worker cache so old cached HTML pages are invalidated.
# Without this, the SW keeps serving stale pages cache-first forever.
SW_OLD=$(grep -o "quran-lights-v[0-9]\+" public/sw.js | head -1)
SW_NUM=$(echo "$SW_OLD" | grep -o "[0-9]\+$")
SW_NEW="quran-lights-$((SW_NUM + 1))"
sed -i "s/$SW_OLD/$SW_NEW/g" public/sw.js
echo "Bumped service worker cache: $SW_OLD -> $SW_NEW"

# Commit any of the above that changed
git add -A
if ! git diff --cached --quiet; then
  git commit -m "chore: deploy v$VERSION"
fi

# Push and deploy
git push
firebase deploy --project quran-lights

echo "✔ Deployed v$VERSION"