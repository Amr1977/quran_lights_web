import { test, expect } from '@playwright/test';

test.describe('Dashboard cache-first render', () => {

  var dummySurasHistory: Record<string, any> = {};
  var now = Date.now();
  for (var i = 1; i <= 114; i++) {
    var hist: number[] = [];
    for (var j = 0; j < (i % 3) + 1; j++) {
      hist.push(now - j * 86400000);
    }
    var key = String(i);
    dummySurasHistory[key] = {
      suraIndex: i,
      history: hist,
    };
  }

  test('renders sura cells from localStorage cache when Firebase is offline', async ({ page }) => {

    var testUid = 'test-cache-uid';

    // Block Firebase RTDB so it can't fetch online data
    await page.route('**/*firebaseio.com**', function (route) {
      return route.abort();
    });
    await page.route('**/googleapis.com/**', function (route) {
      return route.abort();
    });

    // Serve a mock Firebase SDK instead of the real CDN script
    var mockServed = false;
    await page.route('**/*firebase.js', async function (route) {
      console.log('Intercepting Firebase CDN request:', route.request().url());
      mockServed = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: [
          'window.firebase = {',
          '  initializeApp: function() {},',
          '  auth: function() {',
          '    return {',
          '      currentUser: { uid: "' + testUid + '" },',
          '      onAuthStateChanged: function(cb) {',
          '        setTimeout(function() { cb({ uid: "' + testUid + '", email: "test@test.com" }); }, 10);',
          '        return function() {};',
          '      },',
          '    };',
          '  },',
          '  database: function() {',
          '    return {',
          '      ref: function(path) {',
          '        if (path && path.indexOf(".info") !== -1) {',
          '          return {',
          '            on: function(et, cb) { setTimeout(function() { cb({ val: function() { return 0; } }); }, 0); return function() {}; },',
          '            once: function(et, cb) { var s = { val: function() { return 0; } }; if (cb) { cb(s); } return Promise.resolve(s); },',
          '          };',
          '        }',
          '        var snap = { val: function() { return null; }, forEach: function() { return false; }, key: null };',
          '        return {',
          '          on: function(et, cb) { setTimeout(function() { cb(snap); }, 100); return function() {}; },',
          '          once: function(et, cb) { if (cb) { cb(snap); } return Promise.resolve(snap); },',
          '          orderByKey: function() { return this; },',
          '          startAt: function() { return this; },',
          '          update: function() { return Promise.resolve(); },',
          '          remove: function() { return Promise.resolve(); },',
          '          set: function() { return Promise.resolve(); },',
          '          push: function() { return { key: "mock-key", set: function() {} }; },',
          '          limitToLast: function() { return this; },',
          '        };',
          '      },',
          '    };',
          '  },',
          '};',
        ].join('\n'),
      });
    });

    // Stub Highcharts before page scripts load (CDN returns 403 in CI)
    await page.addInitScript(function () {
      window.Highcharts = {
        setOptions: function () {},
        chart: function () { return { destroy: function () {} }; },
        mapChart: function () {},
        seriesTypes: {},
        Point: function () {},
        Series: function () {},
        time: new (function () {})(),
      };
    });

    // Pre-populate localStorage before page scripts execute
    await page.addInitScript(function (payload) {
      var uid = 'test-cache-uid';
      localStorage.setItem('user', JSON.stringify({ uid: uid, email: 'test@test.com' }));
      localStorage.setItem(uid + '_surasHistory', JSON.stringify(payload.surasHistory));
      localStorage.setItem(uid + '_lastTransactionTimeStamp', '0');
      localStorage.setItem(uid + '_sort_order', '1');
      localStorage.setItem(uid + '_selected_suras', JSON.stringify([]));
    }, { surasHistory: dummySurasHistory });

    // Capture console messages for debugging
    var pageErrors: string[] = [];
    page.on('pageerror', function (err) {
      pageErrors.push(err.message);
      console.log('PAGE ERROR:', err.message);
    });
    page.on('console', function (msg) {
      if (msg.type() === 'error') {
        pageErrors.push(msg.type() + ': ' + msg.text());
        console.log('CONSOLE ERROR:', msg.text());
      }
    });

    await page.goto('http://localhost:8080/dashboard.html', { waitUntil: 'networkidle' });

    // Log final URL for debugging
    console.log('Final URL:', page.url());
    console.log('Mock was served:', mockServed);
    console.log('Page errors:', pageErrors.join(' | '));

    // Check if reviews container exists and has content
    var reviewsHtml = await page.locator('#reviews').innerHTML();
    console.log('#reviews innerHTML length:', reviewsHtml.length);
    console.log('#reviews innerHTML (first 500 chars):', reviewsHtml.substring(0, 500));

    var buttons = await page.locator('button').count();
    console.log('Total buttons on page:', buttons);

    // Even with Firebase RTDB blocked, cells should render from localStorage cache
    var cells = page.locator('.sura-cell');
    await expect(cells.first()).toBeVisible({ timeout: 20000 });
    var count = await cells.count();
    expect(count).toBeGreaterThanOrEqual(100);
  });

});
