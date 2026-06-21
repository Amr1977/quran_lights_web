# AGENTS.md — Quran Lights Web

## Tech Stack
- **Vanilla JS** (no framework, no build tools)
- **Firebase Realtime Database** (persistence & sync)
- **jQuery 2.1.3** + **Bootstrap 3.3.7** (UI)
- **Highcharts 8** (charts: column, pie, treemap, radar, solid-gauge, heatmap, area)
- **html2canvas + jsPDF** (export streak views to image/PDF)
- **Playwright + Cucumber** (E2E tests)

## Project Structure
```
public/
├── dashboard.html             # Main SPA dashboard
├── index.html                 # Landing page
├── login.html / signup.html   # Auth pages
├── streak-share.html          # Public shareable streak view
├── js/
│   ├── constants.js           # Firebase config, mode enums
│   ├── utils.js               # localStorage helpers, formatting
│   ├── streakUtils.js         # Pure streak calculation functions
│   └── i18n.js                # 10-language internationalization
├── dashboard/scripts/
│   ├── charts.js              # Master chart orchestrator (update_charts)
│   ├── time_series.js         # Daily/monthly/yearly revenue charts
│   ├── streakChart.js         # Column chart of streak periods
│   ├── streakLineChart.js     # Area chart of running streak over time
│   ├── streakHistoryView.js   # Modal with heatmap, timeline, export
│   ├── streakWidget.js        # Inline streak card on dashboard
│   ├── guage.js               # Solid gauge charts
│   ├── treemap.js             # 114-sura treemap
│   ├── radar.js               # Radar chart of elapsed days
│   ├── khatma.js              # Khatma (Quran cycle) pie chart
│   ├── memorization.js        # Memorization state + pie chart
│   ├── cells.js               # Sura grid cells (114 buttons)
│   ├── main.js                # refreshSura, unrefresh, scores
│   ├── sidebar.js             # Sidebar nav + view switching
│   ├── tabs.js                # Tab switching (legacy)
│   └── sync.js                # Firebase upload queue + dispatch
├── dashboard/css/
│   ├── styles.css
│   ├── sidebar.css
│   └── context-menu.css
└── locales/                   # i18n translation JSON files (ar, en, es, fr, de, zh, hi, pt, ur, ja)
```

## Key Architecture Patterns

### Data Flow
- **All data** stored in Firebase RTDB at `users/{uid}/Master/reviews/`
- **Local cache** in localStorage (keyed by userId)
- **Offline-first**: writes queue to localStorage, dispatch on reconnect
- **Real-time sync**: Firebase `update_stamp` node triggers re-fetch

### Streak System (`public/js/streakUtils.js`)
All streak functions are pure — take `surasHistory` object, return computed values:
- `getSortedUniqueDates(surasHistory)` → date strings sorted
- `getStreakPeriods(surasHistory)` → streak objects with startDate/length
- `getAllStreakSegments(surasHistory)` → green/black day segments
- `getDailyEntryCounts(surasHistory)` → map of date → count
- `getStreakSummary(surasHistory)` → current/best streak, gaps, totals
- `calculateCurrentStreak(surasHistory)` → current consecutive active days
- `formatDate(date)` → `YYYY-MM-DD` format

### Chart Pattern
Every chart follows this pattern:
1. Check container exists → return if not
2. Check Highcharts loaded → show loading text if not
3. Read `surasHistory` from localStorage
4. Process data using streakUtils functions
5. Wrap Highcharts.chart() in try/catch
6. Export function globally (no modules)

### Firebase Sync (`public/dashboard/scripts/sync.js`)
1. `enqueue_for_upload(record)` → push to localStorage upload_queue
2. `dispatch_uploads()` → batch-send queued records to Firebase `.update()`
3. On success → clear queue, update `update_stamp`
4. `connectivity.js` listens for `online` event → triggers dispatch

## Coding Conventions
- **No ES6 modules** — everything is global function scope
- **jQuery** for DOM manipulation (`$()`, `.on()`, `.addClass()`)
- **Bootstrap 3** grid + components
- **var** not const/let (legacy codebase targeting wide browser support)
- **RTL-first** — Arabic is default; `dir="rtl"` on body
- **Naming**: `camelCase` for functions and variables
- **Types**: `surasHistory` is `{ [suraIndex: string]: { history: number[], memorization?: string } }`

## i18n
- 10 languages: ar, en, es, fr, de, zh, hi, pt, ur, ja
- Translation files in `public/locales/{lang}.json`
- `data-i18n="key"` attributes on HTML elements
- `window.i18n.translate(key)` for dynamic text
- **Never hardcode user-facing strings** — always use i18n keys
- **RTL handling**: use `dir="auto"` + `unicode-bidi: plaintext` for mixed text

## Testing
```bash
# Run E2E tests
npx playwright test --config tests/playwright.config.ts

# Run Cucumber BDD tests
npx cucumber-js
```

## Deployment
```bash
# Auto-bump version and deploy (recommended)
./deploy.sh

# Or deploy without version bump
firebase deploy --project quran-lights
```

## Version Management
- Version stored in `public/VERSION` (semver: `MAJOR.MINOR.PATCH`)
- Auto-bumped by `./deploy.sh` (increments PATCH, updates `version.js`, cache-busts all HTML)
- `public/js/version.js` exports `window.APP_VERSION`
- Every HTML page loads `version.js` after `i18n.js`
- Footer on all pages reads `APP_VERSION` dynamically
- Android version in `android/app/build.gradle` → `versionCode` (int) and `versionName` (string)

## Android Build (Capacitor)
```bash
# Install dependencies
npm install

# Sync web assets to Android
npx cap sync android

# Build release APK locally
cd android && ./gradlew assembleRelease
# Output: android/app/build/outputs/apk/release/app-release.apk
```

## GitHub Actions
- On every push to master/main, a workflow builds the release APK automatically
- APK artifact available in the GitHub Actions run summary
- Manual trigger via `workflow_dispatch` in GitHub Actions UI

## Play Store Release Checklist
- [ ] Bump `versionCode` + 1 and `versionName` in `android/app/build.gradle`
- [ ] Run `npx cap sync android`
- [ ] Build release APK (`./gradlew assembleRelease`)
- [ ] Upload to Play Console

## Shared Knowledge Base
Located at `shared-knowledge-base/` (git submodule). Always consult before starting work:
- `lessons-learned.md` — Common mistakes, config patterns, commit checklist
- `deployment/git-hooks.md` — Commit/push workflow best practices
- `bugs/BUG-001-timezone.md` — UTC/local time display patterns
- `bugs/BUG-003-rtl-text.md` — RTL/bidirectional text patterns

## Per-Task Checklist
- [ ] Check AGENTS.md for project-specific patterns
- [ ] Check `shared-knowledge-base/` for relevant patterns or lessons
- [ ] Follow existing code conventions (RTL-first, vanilla JS, jQuery)
- [ ] Verify i18n: no hardcoded strings; add keys to locale files
- [ ] Run `firebase deploy --only hosting` to verify build works
- [ ] Document any new reusable pattern in `shared-knowledge-base/`
