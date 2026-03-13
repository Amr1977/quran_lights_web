// =====================================================
// sw.js — Service Worker for Quran Lights PWA
// =====================================================
// Place in project root (same level as index.html).
// Bump CACHE_NAME on every deploy to bust old cache.
// =====================================================

var CACHE_NAME = 'quran-lights-v1';  // ← change to v2, v3… on each deploy

// ── Pages ──
var PAGES = [
  '/',
  '/index.html',
  '/login.html',
  '/signup.html',
  '/dashboard.html',
  '/age.html',
  '/offline.html',
  '/privacy-policy.html',
  '/terms-of-service.html',
  '/about.html',
];

// ── CSS (index.html) ──
var STYLES_INDEX = [
  '/css/animate.min.css',
  '/css/bootstrap.min.css',
  '/css/font-awesome.min.css',
  '/css/templatemo-style.css',
];

// ── CSS (dashboard.html) ──
var STYLES_DASHBOARD = [
  '/dashboard/css/styles.css',
  '/dashboard/css/sidebar.css',
  '/dashboard/css/context-menu.css',
];

// ── Your JS (index.html) ──
var SCRIPTS_INDEX = [
  '/js/jquery.js',
  '/js/bootstrap.min.js',
  '/js/connectivity.js',
];

// ── Your JS (dashboard.html) — exact paths from <head> ──
var SCRIPTS_DASHBOARD = [
  '/js/i18n.js',
  '/js/constants.js',
  '/js/utils.js',
  '/js/connectivity.js',
  '/login/js/login.js',
  '/dashboard/scripts/context-menu.js',
  '/dashboard/scripts/suras_data.js',
  '/dashboard/scripts/state.js',
  '/dashboard/scripts/sync.js',
  '/dashboard/scripts/main.js',
  '/dashboard/scripts/tabs.js',
  '/dashboard/scripts/init_app.js',
  '/dashboard/scripts/init_cells.js',
  '/dashboard/scripts/keyboard.js',
  '/dashboard/scripts/memorization.js',
  '/dashboard/scripts/bright_days_dark_days_chart.js',
  '/dashboard/scripts/sort.js',
  '/dashboard/scripts/treemap.js',
  '/dashboard/scripts/guage.js',
  '/dashboard/scripts/khatma.js',
  '/dashboard/scripts/time_series.js',
  '/dashboard/scripts/import_and_export.js',
  '/dashboard/scripts/audio.js',
  '/dashboard/scripts/selection.js',
  '/dashboard/scripts/score.js',
  '/dashboard/scripts/cells.js',
  '/dashboard/scripts/charts.js',
  '/dashboard/scripts/radar.js',
  '/dashboard/scripts/sidebar.js',
];

// ── Firebase SDK (v4.2.0 monolithic bundle) ──
var FIREBASE_SDK = [
  'https://www.gstatic.com/firebasejs/4.2.0/firebase.js',
];

// ── CDN JS (dashboard) ──
var CDN_SCRIPTS = [
  'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js',
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
  'https://code.highcharts.com/8.0.0/highcharts.js',
  'https://code.highcharts.com/8.0.0/highcharts-more.js',
  'https://code.highcharts.com/8.0.0/modules/solid-gauge.js',
  'https://code.highcharts.com/8.0.0/modules/exporting.js',
  'https://code.highcharts.com/8.0.0/modules/data.js',
  'https://code.highcharts.com/8.0.0/modules/drilldown.js',
  'https://code.highcharts.com/8.0.0/modules/heatmap.js',
  'https://code.highcharts.com/8.0.0/modules/treemap.js',
  'https://code.highcharts.com/8.0.0/modules/export-data.js',
  'https://code.highcharts.com/8.0.0/modules/accessibility.js',
  'https://code.highcharts.com/8.0.0/themes/dark-unica.js',
];

// ── CDN CSS ──
var CDN_STYLES = [
  'https://code.getmdl.io/1.1.3/material.orange-indigo.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.2.0/animate.min.css',
];

// ── Images ──
var IMAGES = [
  '/landing/images/cells.png',
  '/images/heat-map.png',
  '/images/column.png',
  '/images/radar.png',
  '/images/memorization.png',
  '/images/class.jpg',
  '/images/seeds.jpg',
  '/images/coding.jpg',
  '/images/contact.jpeg',
  '/images/usdt-qr.jpg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// ── Combine all ──
var ALL_CACHED = [].concat(
  PAGES,
  STYLES_INDEX, STYLES_DASHBOARD, CDN_STYLES,
  SCRIPTS_INDEX, SCRIPTS_DASHBOARD,
  FIREBASE_SDK, CDN_SCRIPTS,
  IMAGES
);


// ─────────────────────────────────────────────
// INSTALL
// ─────────────────────────────────────────────
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('[SW] Caching app shell…');
      return Promise.all(
        ALL_CACHED.map(function (url) {
          return cache.add(url).catch(function (err) {
            console.warn('[SW] Could not cache:', url, err.message);
          });
        })
      );
    })
  );
  self.skipWaiting();
});


// ─────────────────────────────────────────────
// ACTIVATE
// ─────────────────────────────────────────────
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(
        names.filter(function (name) { return name !== CACHE_NAME; })
             .map(function (name) {
                 console.log('[SW] Removing old cache:', name);
                 return caches.delete(name);
             })
      );
    })
  );
  self.clients.claim();
});


// ─────────────────────────────────────────────
// FETCH
// ─────────────────────────────────────────────
self.addEventListener('fetch', function (event) {
  var url;
  try {
    url = new URL(event.request.url);
  } catch (e) {
    return;
  }

  // ── NEVER intercept Firebase or Google auth ──
  if (
    url.hostname.indexOf('firebaseio.com') !== -1 ||
    url.hostname.indexOf('googleapis.com') !== -1 ||
    url.hostname.indexOf('identitytoolkit.googleapis.com') !== -1 ||
    url.hostname.indexOf('securetoken.googleapis.com') !== -1 ||
    url.hostname.indexOf('firebaseauth.googleapis.com') !== -1 ||
    event.request.mode === 'websocket'
  ) {
    return;
  }

  // ── NEVER intercept Cloudflare internals ──
  if (url.pathname.indexOf('/cdn-cgi/') === 0) {
    return;
  }

  // ── Cache First for everything else ──
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      if (cached) return cached;

      return fetch(event.request).then(function (response) {
        if (!response || !response.ok) return response;
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(function () {
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});
