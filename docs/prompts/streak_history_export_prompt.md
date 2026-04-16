# OpenCode Agent Prompt: Exportable & Sharable Streak History View

## Context & Background

You are extending an existing **Quran memorization/review tracking app** (Plain JavaScript + jQuery + Firebase).

The previous feature added a **streak tracker** (`streakUtils.js` + `streakWidget.js`) that displays:
- Current white streak (consecutive days WITH entries)
- Longest white streak (all-time best)
- 14-day mini heatmap

This new feature adds a **full history view** that is both exportable (PDF/image) and sharable (link or image). The primary motivation is clinical — a psychiatrist or caregiver can glance at the exported view to identify behavioral patterns associated with bipolar disorder episodes (long black streaks = possible depression, erratic alternating = possible cycling, unusually dense white streaks = possible hypomania).

---

## Definitions

- **White day**: A calendar day with at least one review entry (timestamp) across any Surah
- **Black day**: A calendar day with zero review entries
- **White streak**: Consecutive white days
- **Black streak**: Consecutive black days
- The history view should visualize BOTH, giving a complete behavioral rhythm picture

---

## Feature Requirements

### 1. Full History Heatmap (`streakHistoryView.js`)

Create `public/dashboard/scripts/streakHistoryView.js`.

#### A. Yearly Heatmap (GitHub-style contribution graph)

- Display a **grid of day cells** covering the last 12 months (or from first entry date, whichever is shorter)
- Layout: weeks as columns, days of week (Sat→Fri or Sun→Sat based on locale) as rows
- Each cell represents one calendar day
- Cell color:
  - **White/filled** day: use a green or teal tone (match app's existing accent color)
  - **Black/empty** day: use a dark grey or near-black cell
  - Days before the user's first ever entry: render as transparent/invisible
  - Today: subtle border ring

```javascript
// Color scale suggestion (adjust to match app palette):
// 0 entries (black day): #1f1f1f or #374151
// 1+ entries (white day): use intensity based on number of surahs reviewed:
//   1 surah:   #bbf7d0  (light green)
//   2-3 surahs: #4ade80 (medium green)
//   4-6 surahs: #16a34a (strong green)
//   7+ surahs:  #14532d (deep green)
// This adds a second dimension: not just did they review, but how much
```

#### B. Month Labels
- Show abbreviated month names above the column grid (Jan, Feb, ... or Arabic equivalents)
- Align labels to the correct week column

#### C. Day Tooltips
- On hover, show a tooltip:
  - White day: "📅 [Date] — reviewed [N] Surah(s)"
  - Black day: "📅 [Date] — no entries"
  - Use a simple CSS/JS tooltip (no external library)

#### D. Summary Stats Bar
Display above or below the heatmap:

```
🔥 Current streak: X days     ⬛ Current black streak: Y days
🏆 Longest white streak: A days     💀 Longest black streak: B days
📊 Active days: C / D total days (E%)
📅 Tracking since: [first entry date]
```

The "longest black streak" is clinically the most meaningful metric for depression monitoring.

#### E. White/Black Streak Timeline (optional but recommended)
- A secondary compact visualization below the heatmap
- A horizontal bar showing alternating white (colored) and black (dark) segments over time
- Each segment's width is proportional to its duration
- Hovering a segment shows: "White streak: X days (start date → end date)" or "Black streak: Y days"
- This makes episode cycles visually obvious at a glance

---

### 2. Streak History Logic Extensions (`streakUtils.js`)

Add these functions to the existing `streakUtils.js`:

```javascript
/**
 * Returns all white and black streak segments in chronological order
 * @param {Object} surasHistory
 * @returns {Array<{type: 'white'|'black', days: number, startDate: string, endDate: string}>}
 */
function getAllStreakSegments(surasHistory)

/**
 * Returns the longest black streak ever
 * @param {Object} surasHistory
 * @returns {number}
 */
function calculateLongestBlackStreak(surasHistory)

/**
 * Returns current black streak (consecutive days without entries ending today/yesterday)
 * @param {Object} surasHistory
 * @returns {number}
 */
function calculateCurrentBlackStreak(surasHistory)

/**
 * Returns per-day entry counts for heatmap intensity
 * @param {Object} surasHistory
 * @returns {Object} Map of { "YYYY-MM-DD": numberOfSurahsReviewed }
 */
function getDailyEntryCounts(surasHistory)

/**
 * Returns a summary stats object
 * @param {Object} surasHistory
 * @returns {{ currentWhite, longestWhite, currentBlack, longestBlack, totalActiveDays, totalDays, trackingSince }}
 */
function getStreakSummary(surasHistory)
```

**For `calculateCurrentBlackStreak`:**
- Walk backwards from yesterday (today is still "open")
- Count consecutive days with no entries
- Stop when a white day is found
- If today has entries, current black streak = 0

---

### 3. Export as Image (PNG)

Add an **"Export as Image"** button to the history view.

Use the `html2canvas` library to capture the heatmap + stats bar as a PNG:

```html
<!-- Add to index.html or load dynamically -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
```

```javascript
function exportStreakImage() {
    var element = document.getElementById('streak-history-container');
    html2canvas(element, {
        backgroundColor: '#0f172a', // match app dark background
        scale: 2, // retina quality
        useCORS: true
    }).then(function(canvas) {
        var link = document.createElement('a');
        link.download = 'quran-streak-' + getTodayDateString() + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}
```

The exported image should be **self-contained and readable without the app** — include the user's name (if available) and export date as a header inside the captured element.

---

### 4. Export as PDF

Add an **"Export as PDF"** button using `jsPDF` + `html2canvas`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

```javascript
function exportStreakPDF() {
    var element = document.getElementById('streak-history-container');
    html2canvas(element, { scale: 2, backgroundColor: '#0f172a' }).then(function(canvas) {
        var imgData = canvas.toDataURL('image/png');
        var pdf = new jspdf.jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [canvas.width / 2, canvas.height / 2]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
        pdf.save('quran-streak-' + getTodayDateString() + '.pdf');
    });
}
```

---

### 5. Share as Link (Firebase)

Since the app already uses Firebase, implement **shareable read-only snapshot links**:

#### A. Generate Snapshot
When the user clicks "Share", serialize the current streak summary + heatmap data and save to Firebase:

```javascript
function generateShareableSnapshot() {
    var surasHistory = get_local_storage_object("surasHistory") || {};
    var summary = getStreakSummary(surasHistory);
    var dailyCounts = getDailyEntryCounts(surasHistory);
    var segments = getAllStreakSegments(surasHistory);

    var snapshot = {
        createdAt: Date.now(),
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
        summary: summary,
        dailyCounts: dailyCounts,  // { "YYYY-MM-DD": N }
        segments: segments,
        displayName: getCurrentUserDisplayName() || "Anonymous"
    };

    // Save to Firebase under /streakSnapshots/{snapshotId}
    return firebase.database().ref('streakSnapshots').push(snapshot)
        .then(function(ref) {
            return window.location.origin + '/streak-share?id=' + ref.key;
        });
}
```

#### B. Share UI
After generating, show a modal with:
- The shareable URL (copyable with one click)
- A QR code (use `qrcode.js` from CDN or generate a link to a QR service)
- "Copy Link" button
- "Open" button to preview in new tab
- Note: "This link expires in 30 days"

```html
<!-- QR code library -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
```

#### C. Read-only Shared View (`/streak-share` route or `streak-share.html`)
Create a separate page `public/streak-share.html` that:
- Reads `?id=` from the URL query string
- Fetches the snapshot from Firebase: `/streakSnapshots/{id}`
- Checks `expiresAt` — show "Link expired" if past
- Renders the heatmap + stats in read-only mode using the same CSS
- Shows a banner: "📊 Streak history shared by [displayName] on [date]"
- Has a subtle "Track your own Quran review →" CTA linking back to the app

---

### 6. Firebase Security Rules

Add rules for the snapshot path (update `database.rules.json`):

```json
"streakSnapshots": {
  ".read": true,
  "$snapshotId": {
    ".write": "auth != null",
    ".validate": "newData.hasChildren(['createdAt', 'summary', 'dailyCounts'])"
  }
}
```

---

### 7. UI Entry Point

Add a **"📊 View Full History"** button to the existing `StreakWidget`:
- Opens the history view as a modal overlay or a new section below the widget
- The modal/panel contains: heatmap, stats bar, streak timeline, and action buttons (Export PNG / Export PDF / Share Link)
- Close button (X) or click-outside to dismiss
- Smooth open/close animation

```javascript
// Inject into existing streakWidget.js render function
var historyBtn = '<button id="open-streak-history" class="btn btn-sm btn-outline-secondary mt-2">📊 View Full History</button>';

$('#open-streak-history').on('click', function() {
    renderStreakHistoryModal();
});
```

---

## Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `public/js/streakUtils.js` | **Modify** | Add black streak + segment + summary functions |
| `public/dashboard/scripts/streakHistoryView.js` | **Create** | Full heatmap + export + share UI |
| `public/dashboard/scripts/streakWidget.js` | **Modify** | Add "View Full History" button |
| `public/dashboard/index.html` | **Modify** | Add CDN scripts (html2canvas, jsPDF, qrcode.js) |
| `public/streak-share.html` | **Create** | Read-only shareable snapshot page |
| `database.rules.json` | **Modify** | Add streakSnapshots security rules |

---

## Testing Checklist

- [ ] Heatmap renders correctly for last 12 months
- [ ] White days show correct intensity based on surah count
- [ ] Black days are visually distinct (dark cells)
- [ ] Month labels align correctly to columns
- [ ] Hover tooltip shows correct date and entry count
- [ ] Summary stats are accurate (spot check against known data)
- [ ] `calculateCurrentBlackStreak` returns 0 when today has entries
- [ ] `calculateLongestBlackStreak` scans full history correctly
- [ ] Streak timeline segments are in correct chronological order
- [ ] Export PNG produces a clean, readable image at 2x resolution
- [ ] Export PDF opens/downloads correctly in landscape orientation
- [ ] Share link generates and is copyable
- [ ] Shareable page loads from Firebase and renders correctly
- [ ] Expired links show appropriate message
- [ ] Modal opens and closes smoothly
- [ ] Works on mobile (heatmap scrolls horizontally if needed)

---

## Notes for the Agent

- **Framework**: Plain JavaScript + jQuery (no React/Vue)
- **Timestamps**: stored in seconds, convert with `* 1000` for JS Date
- **Storage key**: `{myUserId}_surasHistory`
- **Existing utilities**: reuse `get_local_storage_object`, `set_local_storage_object`, `showToast`, `todayStartTimeStamp`
- **CDN libraries allowed**: html2canvas, jsPDF, qrcode.js (all from cdnjs.cloudflare.com)
- **No new npm dependencies** — load via `<script>` tags
- **Firebase**: already initialized in the app, use `firebase.database()` directly
- **Heatmap must scroll horizontally on mobile** — do not shrink cells below 10px
- **The exported/shared view is the primary clinical artifact** — prioritize its readability and completeness over the in-app view
