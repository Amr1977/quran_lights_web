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

# Commit
git add -A
git commit -m "chore: bump version to $NEW_VERSION"

# Push and deploy
git push
firebase deploy --project quran-lights

echo "✔ Deployed v$NEW_VERSION"
