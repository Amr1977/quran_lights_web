#!/bin/bash
# Auto-increment version based on conventional commit message
# Reads VERSION file, parses last commit message, bumps accordingly
# Usage: scripts/version-bump.sh

VERSION_FILE="VERSION"
PACKAGE_JSON="package.json"

if [ ! -f "$VERSION_FILE" ]; then
  echo "No VERSION file found at $VERSION_FILE"
  exit 1
fi

source "$VERSION_FILE"

LAST_COMMIT=$(git log -1 --pretty=%B)

BUMP="none"
if echo "$LAST_COMMIT" | grep -qE "BREAKING CHANGE|!:"; then
  BUMP="major"
elif echo "$LAST_COMMIT" | grep -qE "^feat|^perf"; then
  BUMP="minor"
elif echo "$LAST_COMMIT" | grep -qE "^fix|^docs|^style|^refactor|^test|^build|^ci|^revert"; then
  BUMP="patch"
fi

if [ "$BUMP" = "none" ]; then
  exit 0
fi

case "$BUMP" in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
esac

NEW_VERSION="$MAJOR.$MINOR.$PATCH"

cat > "$VERSION_FILE" << EOF
MAJOR=$MAJOR
MINOR=$MINOR
PATCH=$PATCH
BUILD_DATE=$(date +%Y-%m-%d)
EOF

if [ -f "$PACKAGE_JSON" ]; then
  if command -v jq &> /dev/null; then
    jq ".version = \"$NEW_VERSION\"" "$PACKAGE_JSON" > tmp.json && mv tmp.json "$PACKAGE_JSON"
  else
    sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" "$PACKAGE_JSON"
  fi
fi

echo "  ✓ bumped to $NEW_VERSION ($BUMP)"
