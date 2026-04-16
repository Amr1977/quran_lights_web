# Agent Prompt: Quran Lights Web — Cleanup & Open Source Polish

## Task
Update the `quran_lights_web` repository with the following changes in a single pass.

---

## CHANGE 1: Remove All iOS / App Store References

Search the ENTIRE repo for any of the following:

**Targets:**
- Any URL containing `itunes.apple.com`, `apps.apple.com`, `apple.com`
- Any `[![iOS App](...)` shield badge in markdown
- Any `<img>` or `<a>` tags in HTML/JS referencing the App Store
- Text strings: "iOS", "App Store", "Apple", "iPhone", "iPad", "itunes"
  (in .html, .js, .md files only — ignore binary/zip files)

**Rules:**
- If iOS badge sits alongside Android badge → remove iOS only, keep Android
- If section is iOS-only → remove entire section
- If copy says "iOS and Android" → change to "Android (PWA)" only
- Do NOT add "coming soon" or any placeholder iOS text — remove cleanly
- Keep PLAYSTORE.md and ANDROID.md untouched

**Verification:**
After changes, grep for `itunes`, `apple.com`, `App Store`, `iOS App` → must return zero results.

---

## CHANGE 2: Fix Mismatched URLs in README

Current state:
- Live Demo badge links to: `https://quran-lights.web.app`
- Repo website field shows: `https://quranlights.et3am.com`
- Contact section website shows: `https://quran-lights.web.app`

**Fix:**
- Standardize ALL app URLs in README.MD to: `https://quranlights.et3am.com`
- Update the Live Demo badge href to point to `https://quranlights.et3am.com`
- Update the Contact section website link to `https://quranlights.et3am.com`

---

## CHANGE 3: Fix Placeholder Contact Email

In README.MD, the contact email is set to `amr@example.com` (a placeholder).

**Fix:**
- Change it to: `amr.lotfy.othman@gmail.com`
  (Use this as the best guess domain since the app lives under et3am.com.
   If a different email is found elsewhere in the repo, use that instead.)

---

## CHANGE 4: Add GitHub Topics to README (Badge Section)

Add the following topic/discovery badge to the badge row at the top of README.MD,
after the existing badges:

```
[![Topics](https://img.shields.io/badge/topics-quran%20%7C%20islamic%20%7C%20pwa%20%7C%20memorization%20%7C%20arabic-green)]()
```

Also add a comment block just above it:

```
<!-- Suggested GitHub Topics to add via repo Settings > Topics:
     quran, islamic, pwa, memorization, arabic, hafiz, quran-tracker -->
```

This reminds the repo owner to also set topics via the GitHub UI
(which cannot be done via code changes alone).

---

## CHANGE 5: Add Screenshots Section to README

After the Features section and before the Tech Stack section, insert:

```markdown
## 📸 Screenshots

> Add screenshots here to showcase the dashboard, heatmaps, and analytics.
> Recommended: drag and drop images into this section via GitHub's editor,
> or place them in `public/images/screenshots/` and reference them below.

| Dashboard | Heatmap | Analytics |
|-----------|---------|-----------|
| _screenshot coming soon_ | _screenshot coming soon_ | _screenshot coming soon_ |
```

---

## CHANGE 6: Add GitHub Release Instructions to BUILD.md

Do NOT create a release programmatically.
Instead, add the following section to BUILD.md
(append at the end if the section doesn't already exist):

```markdown
## Creating a GitHub Release

To publish a GitHub release:
1. Go to the repo on GitHub → Releases → Draft a new release
2. Tag: `v2.0.0` (or current version from package.json)
3. Title: `Quran Lights v2.0.0`
4. Copy the latest changelog or feature list from README as the description
5. Publish release
```

---

## Final Verification

After all changes are applied, run:

```bash
grep -r "itunes" . --include="*.html" --include="*.js" --include="*.md"
grep -r "apple.com" . --include="*.html" --include="*.js" --include="*.md"
grep -r "example.com" . --include="*.html" --include="*.js" --include="*.md"
```

All three must return zero results.

---

## Output Required

List every file modified with a line-level summary of what changed.
