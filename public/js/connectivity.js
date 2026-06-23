// =====================================================
// js/connectivity.js — Online/Offline navbar indicator + retry trigger
// =====================================================
// Plain global script. Self-initializing. No dependencies.
//
// Does two things:
//   1. Adds/removes an offline indicator dot in the navbar
//   2. When the app comes back online, triggers dispatch_uploads()
//      so any queued writes (already saved in localStorage by
//      enqueue_for_upload) get sent immediately — no need to
//      wait for the next timeout.
// =====================================================

(function () {
  'use strict';

  var INDICATOR_ID = 'ql-offline-indicator';

  function createIndicator() {
    if (document.getElementById(INDICATOR_ID)) return;
    var nav = document.querySelector('.navbar-actions');
    if (!nav) return;

    var dot = document.createElement('span');
    dot.id = INDICATOR_ID;
    dot.title = 'أنت غير متصل بالإنترنت — سيتم حفظ التغييرات تلقائياً عند العودة للإنترنت';
    dot.style.cssText = [
      'display:none;',
      'width:10px;',
      'height:10px;',
      'border-radius:50%;',
      'background:#e94560;',
      'box-shadow:0 0 6px rgba(233,69,96,0.8);',
      'margin:0 8px;',
      'vertical-align:middle;',
      'animation:ql-pulse 1.5s infinite;',
    ].join('');
    nav.appendChild(dot);
  }

  function injectPulseKeyframes() {
    if (document.getElementById('ql-pulse-style')) return;
    var style = document.createElement('style');
    style.id = 'ql-pulse-style';
    style.textContent = '@keyframes ql-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }';
    document.head.appendChild(style);
  }

  function update() {
    var dot = document.getElementById(INDICATOR_ID);
    if (!dot) return;
    dot.style.display = navigator.onLine ? 'none' : 'inline-block';
  }

  function onOnline() {
    update();

    if (typeof dispatch_uploads === 'function') {
      console.log('[Connectivity] Back online — flushing upload queue.');
      dispatch_uploads();
    }
  }

  function init() {
    injectPulseKeyframes();
    createIndicator();
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
