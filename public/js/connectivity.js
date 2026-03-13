// =====================================================
// js/connectivity.js — Online/Offline banner + retry trigger
// =====================================================
// Plain global script. Self-initializing. No dependencies.
//
// Does two things:
//   1. Shows/hides an Arabic offline banner at the top
//   2. When the app comes back online, triggers dispatch_uploads()
//      so any queued writes (already saved in localStorage by
//      enqueue_for_upload) get sent immediately — no need to
//      wait for the next timeout.
// =====================================================

(function () {
  'use strict';

  var BANNER_ID = 'ql-offline-banner';

  function createBanner() {
    if (document.getElementById(BANNER_ID)) return;

    var banner = document.createElement('div');
    banner.id = BANNER_ID;
    banner.style.cssText = [
      'display:none;',
      'position:fixed;',
      'top:0;',
      'left:0;',
      'right:0;',
      'z-index:999999;',
      'background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);',
      'border-bottom:1px solid rgba(233,69,96,0.4);',
      'color:#e0e0e0;',
      'text-align:center;',
      'padding:7px 16px;',
      'font-family:"Open Sans",system-ui,sans-serif;',
      'font-size:14px;',
      'box-shadow:0 2px 8px rgba(0,0,0,0.4);',
    ].join('');

    banner.innerHTML =
      '<span style="margin-left:6px;">&#128240;</span> ' +
      '<span>أنت غير متصل بالإنترنت &mdash; سيتم حفظ التغييرات تلقائياً عند العودة للإنترنت</span>';

    document.body.insertBefore(banner, document.body.firstChild);
  }

  function update() {
    var banner = document.getElementById(BANNER_ID);
    if (!banner) return;
    banner.style.display = navigator.onLine ? 'none' : 'block';
  }

  function onOnline() {
    update();

    // ── Flush pending uploads on reconnect ──
    // dispatch_uploads() lives in sync.js. It reads upload_queue
    // from localStorage. If there are queued writes they get sent
    // immediately instead of waiting for the next setTimeout.
    // typeof check is safe — this script also loads on index.html
    // where dispatch_uploads doesn't exist.
    if (typeof dispatch_uploads === 'function') {
      console.log('[Connectivity] Back online — flushing upload queue.');
      dispatch_uploads();
    }
  }

  function init() {
    createBanner();
    update();
    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', update);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
