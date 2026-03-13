# Quran Lights — Offline PWA Integration Guide

## What we discovered (and why the patch is smaller than expected)

After reading `sync.js` and `state.js`, it turns out your app already has
most of the offline write infrastructure in place:

| Already works | What was broken |
|---|---|
| `enqueue_for_upload()` saves writes to `localStorage` immediately | `dispatch_uploads()` shows a blocking `alert()` when offline — freezes the UI |
| `upload_queue` survives page closes (it's in localStorage) | The redundant `.set({})` on line 65 fires a separate Firebase call that also errors when offline |
| `transactions_history` caches the full review history in localStorage | No Service Worker → the app shell doesn't load at all on a cold offline start |
| Retry logic reschedules uploads after failure | No PWA manifest → can't install to home screen |
| `initCells()` reads from localStorage to render the grid | No banner → user doesn't know they're offline |

So the fix is focused: **patch `sync.js` (2 changes), add a Service Worker,
add a manifest, add a connectivity banner.** No new IndexedDB layer needed —
localStorage already handles everything for your data volume.

---

## Files

```
your-project/
├── index.html              ← MODIFY (add 5 meta lines + SW registration)
├── dashboard.html          ← MODIFY (add 5 meta lines + 1 script tag + SW registration)
├── dashboard/scripts/
│   └── sync.js             ← REPLACE with the patched version
├── sw.js                   ← NEW (project root)
├── manifest.json           ← NEW (project root)
├── offline.html            ← NEW (project root)
├── js/
│   └── connectivity.js     ← NEW
├── icons/
│   ├── icon-192.png        ← NEW (generate at realfavicongenerator.net)
│   └── icon-512.png        ← NEW
└── …
```

---

## Step 1 — Replace `dashboard/scripts/sync.js`

Replace your existing `sync.js` with the patched version. Only two things changed:

**Change 1 — removed the redundant `.set({})`** (was line 65):

```javascript
// BEFORE (inside the forEach in dispatch_uploads):
firebase.database().ref(`users/${…}/Master/reviews/` + transactionTimeStamp).set({});
updates[`users/${…}/Master/reviews/` + transactionTimeStamp] = transacton_record;

// AFTER:
// The .set({}) line is deleted. The .update() call below already writes
// the full transaction_record to the same key. The .set({}) was writing
// an empty object to the same path, then .update() overwrote it — and
// when offline, the .set({}) threw an error that broke the upload flow.
updates[`users/${…}/Master/reviews/` + transactionTimeStamp] = transacton_record;
```

**Change 2 — removed the `alert()` and added an offline guard** (was lines 72–78):

```javascript
// BEFORE:
if (error) {
  alert("Data could not be saved, check your connection. " + error);
  // …retry…
}

// AFTER:
if (error) {
  console.log("[Sync] Upload failed (will retry):", error);
  // …retry… (same as before)
}
```

Also added at the top of `dispatch_uploads()`:

```javascript
if (!navigator.onLine) {
  console.log("[Sync] Offline — upload deferred.");
  return;  // don't even attempt; connectivity.js will call us on reconnect
}
```

Everything else in the file is identical.

---

## Step 2 — Modify `index.html`

### 2a. Add PWA meta tags before `</head>`

```html
    <!-- PWA -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#1a1a2e">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
```

### 2b. Add Service Worker + connectivity banner

After `bootstrap.min.js` at the bottom of `<body>`:

```html
    <script src="js/bootstrap.min.js"></script>

    <!-- ── ADD THESE ── -->
    <script src="js/connectivity.js"></script>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').then(function(reg) {
            console.log('[PWA] SW registered:', reg.scope);
            setInterval(function() { reg.update(); }, 60000);
          }).catch(function(err) {
            console.error('[PWA] SW failed:', err);
          });
        });
      }
    </script>
    <!-- ── END ── -->
```

---

## Step 3 — Modify `dashboard.html`

### 3a. Add PWA meta tags before `</head>` (same as index.html)

```html
    <!-- PWA -->
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#1a1a2e">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
```

### 3b. Add connectivity.js — ONE script tag

Add it right after `firebase.js` (after line 14 in your dashboard.html):

```html
    <script src="https://www.gstatic.com/firebasejs/4.2.0/firebase.js"></script>
    <!-- ── ADD THIS ── -->
    <script src="js/connectivity.js"></script>
    <!-- ── END ── -->
    <script src="dashboard/scripts/suras_data.js?v=…"></script>
```

### 3c. Add Service Worker registration

At the very end of `<body>`, after `sidebar.js` (after line 569):

```html
    <script src="dashboard/scripts/sidebar.js?v=2.3"></script>
    <!-- ── ADD THIS ── -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').then(function(reg) {
            console.log('[PWA] SW registered:', reg.scope);
            setInterval(function() { reg.update(); }, 60000);
          }).catch(function(err) {
            console.error('[PWA] SW failed:', err);
          });
        });
      }
    </script>
    <!-- ── END ── -->
</body>
```

---

## Step 4 — Generate icons

Go to **https://realfavicongenerator.net**, upload your logo,
download 192×192 and 512×512 PNGs → put in `/icons/`.

---

## Step 5 — Deploy

```bash
firebase deploy --only hosting
```

---

## Testing

| Test | How |
|---|---|
| **Install** | Chrome on Android → menu → "Add to home screen" |
| **Offline read** | Open dashboard online. Close browser completely. Turn off WiFi + mobile data. Reopen. Surah cells should render from localStorage cache. |
| **Offline write** | While offline, double-click a surah cell. It lights up immediately (that's `enqueue_for_upload` + `initCells` working from localStorage). No alert pops up. Turn WiFi on. Wait 2–3 sec. Check Firebase Console — the record appears under `reviews/`. |
| **Banner** | Turn off network → Arabic banner at top. Turn on → disappears. |
| **DevTools** | Application → Service Workers → "activated". Network → Offline → reload → app loads. |

---

## How offline writes work now (step by step)

```
User double-clicks a surah cell (offline)
  ↓
  cells.js creates a transaction_record { op, sura, time, uuid, … }
  ↓
  enqueue_for_upload(transaction_record)
    → pushes record to localStorage "upload_queue"        ← survives page close
    → adds record to localStorage "transactions_history"  ← grid re-renders from this
    → schedules dispatch_uploads() via setTimeout
  ↓
  initCells() / add_sura_cells() re-renders grid from localStorage  ← instant UI update
  ↓
  dispatch_uploads() fires after the delay
    → sees navigator.onLine === false
    → logs "Offline — upload deferred"
    → returns immediately (does NOT call Firebase, does NOT alert)
  ↓
  … user is still offline, taps more surahs, all queued …
  ↓
  User goes back online
  ↓
  connectivity.js 'online' event fires
    → calls dispatch_uploads()
  ↓
  dispatch_uploads() runs
    → navigator.onLine === true, proceeds
    → builds updates object from upload_queue
    → firebase.database().ref().update(updates)  → succeeds
    → removes sent records from upload_queue
    → sets update_stamp to trigger sync on other devices
```
