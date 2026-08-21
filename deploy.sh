#!/bin/bash
# Auto-increment patch version and deploy

set -e

# Read current version
VERSION=$(cat public/VERSION | tr -d ' \n')
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"
NEW_PATCH=$((PATCH + 1))
NEW_VERSION="${MAJOR}.${MINOR}.${NEW_PATCH}"

echo "Bumping: $VERSION -> $NEW_VERSION"

# Write new version
echo -n "$NEW_VERSION" > public/VERSION
echo "var APP_VERSION = \"$NEW_VERSION\";" > public/js/version.js

# Update HTML files that have hardcoded version placeholders
find public -name '*.html' -exec sed -i "s/v[0-9]\+\.[0-9]\+\.[0-9]\+/v$NEW_VERSION/g" {} +

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

# Commit
git add -A
git commit -m "chore: bump version to $NEW_VERSION"

# Push and deploy
git push
firebase deploy --project quran-lights

echo "✔ Deployed v$NEW_VERSION"
