# OpenCode Agent Prompt: Quran Review Streak Visualization

## Context & Background

You are working on a **Quran memorization/review tracking app** (Plain JavaScript + jQuery + Firebase). The app has:
- A dashboard with per-Surah review cells
- `surasHistory` stored in localStorage (key: `{userId}_surasHistory`)
- Each sura has a `history` array containing timestamps (seconds) of review entries
- Existing utilities: `get_local_storage_object()`, `set_local_storage_object()`, `todayStartTimeStamp()`

---

## Feature to Implement: Consecutive Days Streak Tracker

### What is a "streak"?
A streak day is any calendar day where the user made **at least one review entry** (timestamp in history array) for any Surah. Consecutive such days form a streak. Missing a day resets the streak to 0.

**Note:** Unlike the original prompt, this app does NOT have a `value` field — every timestamp in history counts as a review entry. No filtering by value needed.

---

## Requirements

### 1. Core Streak Logic (`streakUtils.js`)

Place in `public/js/streakUtils.js`. Implement:

```javascript
/**
 * @param {Object} surasHistory - The surasHistory object from localStorage
 * @returns {number} Current consecutive days streak
 */
function calculateCurrentStreak(surasHistory)

/**
 * @param {Object} surasHistory - The surasHistory object from localStorage
 * @returns {number} Longest consecutive days streak ever
 */
function calculateLongestStreak(surasHistory)

/**
 * @param {Object} surasHistory - The surasHistory object from localStorage
 * @param {number} numberOfDays - Number of days to return (default 14)
 * @returns {Array<{date: string, hasEntry: boolean}>} Last N days with entry status
 */
function getStreakHistory(surasHistory, numberOfDays = 14)

/**
 * @param {Object} surasHistory - The surasHistory object from localStorage
 * @returns {boolean} True if streak is broken (no entries yesterday AND no entries today)
 */
function isStreakBroken(surasHistory)
```

**Data Access:**
```javascript
// Load surasHistory (same pattern as existing code)
var surasHistory = get_local_storage_object("surasHistory") || {};

// Extract all unique dates with at least one entry across all surahs
function getUniqueReviewDates(surasHistory) {
    var dates = new Set();
    for (var suraIndex in surasHistory) {
        var history = surasHistory[suraIndex].history || [];
        history.forEach(function(timestamp) {
            var date = timestampToLocalDateString(timestamp);
            dates.add(date);
        });
    }
    return Array.from(dates).sort();
}

// Convert timestamp (seconds) to local YYYY-MM-DD
function timestampToLocalDateString(timestamp) {
    var date = new Date(timestamp * 1000); // timestamps are in seconds
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + "-" + month + "-" + day;
}
```

**Edge cases:**
- If user has entries today, today counts toward streak
- No entry today but had one yesterday = streak still active (not broken yet)
- Compare dates in local timezone (not UTC)
- Handle empty or null surasHistory gracefully

---

### 2. Streak Display Component (`StreakWidget`)

Create `public/dashboard/scripts/streakWidget.js` that injects HTML into the dashboard.

#### A. Current Streak Counter
- Large, bold number with 🔥 flame icon
- Label: "days streak" / "أيام متتالية"
- Color coding:
  - 0 days → muted grey (`#9ca3af`)
  - 1–6 days → warm orange (`#f97316`)
  - 7–29 days → bright amber (`#ea580c`)
  - 30–99 days → gold (`#eab308`)
  - 100+ days → gradient gold with subtle glow animation

#### B. Personal Best
- 🏆 icon + number + "best" label
- If current streak ≥ personal best, show "✨ New Record!" badge

#### C. Mini Heatmap (last 14 days)
- 14 small circles in a row (oldest left → today right)
- Filled = had entries that day, empty = no entries
- Today's circle has a border ring
- Hover shows date tooltip

#### D. Streak Broken State
- When streak is 0 and previously > 0, show: "Your last streak was X days — start a new one today! 🌱"
- Do NOT show on first-time use (no history at all)

---

### 3. Milestone Celebrations

Trigger visual celebration at: **3, 7, 14, 30, 60, 100, 365** days.

Implementation options:
- Use existing `showToast()` function from utils.js
- Store milestone state in localStorage: `{userId}_celebrated_milestones` (array of achieved milestones)
- Check on each render and only trigger if newly achieved

```javascript
function checkAndCelebrateMilestone(currentStreak) {
    var milestones = [3, 7, 14, 30, 60, 100, 365];
    var key = myUserId + "_celebrated_milestones";
    var celebrated = get_local_storage_object(key) || [];
    
    for (var i = 0; i < milestones.length; i++) {
        var m = milestones[i];
        if (currentStreak >= m && !celebrated.includes(m)) {
            celebrated.push(m);
            set_local_storage_object(key, celebrated);
            showToast("🎉 " + m + " day streak! Keep it up!");
            // Optional: trigger confetti or animation
        }
    }
}
```

---

### 4. Placement in UI

- Inject widget into the dashboard header area
- Look for existing container elements (e.g., `#dashboard-header`, `.stats-panel`)
- On mobile: compact horizontal layout: 🔥 12 | 🏆 31 with heatmap below
- Add subtle entrance animation (fade + slide up)

Find the appropriate location by checking:
- `public/dashboard/index.html` or equivalent
- Existing dashboard structure in the HTML

---

### 5. Integration with Existing Data

Read from existing `surasHistory`:
```javascript
var surasHistory = get_local_storage_object("surasHistory") || {};
```

The widget should:
- Call `calculateCurrentStreak(surasHistory)` on init
- Re-render when `surasHistory` changes (listen to localStorage or existing update mechanisms)
- Use existing update pattern: the app already calls `initCells()` or similar on data changes

---

### 6. Longest Streak Persistence

- Recalculate from `surasHistory` on every load (derived, not stored)
- This ensures accuracy if entries are edited/deleted

---

## Design Guidelines

- **Match existing app style**: Use same colors, fonts, border-radius from Bootstrap/jQuery UI already in use
- Flame icon: Use emoji 🔥 or inline SVG (avoid external icon libraries)
- Widget should complement, not dominate the main Surah tracking interface
- Use existing CSS classes where possible (Bootstrap utilities)
- Add entrance animation with CSS:
```css
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.streak-widget { animation: fadeInUp 0.5s ease-out; }
```

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `public/js/streakUtils.js` | **Create** | Pure functions for streak logic |
| `public/dashboard/scripts/streakWidget.js` | **Create** | Visual streak display component |
| `public/dashboard/scripts/main.js` | **Modify** | Initialize streak widget on load |
| `public/dashboard/index.html` or main HTML | **Modify** | Add container for streak widget |

---

## Testing Checklist

- [ ] Streak shows 0 when no entries exist
- [ ] Streak counts consecutive days (not total days)
- [ ] Today with entries counts; today without but yesterday had = streak alive
- [ ] Missing a day resets to 0 on NEXT day
- [ ] Longest streak reflects all-time best
- [ ] Heatmap shows correct 14-day window (today on right)
- [ ] New record indicator when current ≥ best
- [ ] Widget updates when new entry added
- [ ] Works across timezone boundaries (local timezone)
- [ ] Handles empty/null surasHistory gracefully

---

## Notes

- **Framework**: Plain JavaScript (NOT React/Vue/Angular)
- **Entry format**: Timestamps (seconds), not date strings
- **No value field**: Every timestamp counts as a review
- **Storage key**: `{myUserId}_surasHistory` (user ID prefixed)
- **Utilities**: Use existing `get_local_storage_object`, `showToast` from utils.js
- **No external dependencies**: Avoid adding new libraries; use vanilla JS
