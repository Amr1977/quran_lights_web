// =====================================================
// bundle.js — Offline-capable library loader
// =====================================================
// Local-first: prefers the bundled copy under js/lib and only falls back
// to CDN when the local file is genuinely unavailable.
// =====================================================

(function() {
    'use strict';
    
    var isOnline = navigator.onLine;
    var loadedLibs = {};
    
    // CDN URLs
    var cdnLibs = {
        jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js',
        bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
        highcharts: 'https://code.highcharts.com/8.0.0/highcharts.js',
        highchartsMore: 'https://code.highcharts.com/8.0.0/highcharts-more.js',
        solidGauge: 'https://code.highcharts.com/8.0.0/modules/solid-gauge.js'
    };
    
    // Local paths (for app bundle)
    var localLibs = {
        jquery: '/js/lib/jquery.min.js',
        bootstrap: '/js/lib/bootstrap.min.js',
        highcharts: '/js/lib/highcharts.min.js',
        highchartsMore: '/js/lib/highcharts-more.js',
        solidGauge: '/js/lib/solid-gauge.js'
    };
    
    window.loadLib = function(name, callback) {
        if (loadedLibs[name]) {
            if (callback) callback(true);
            return;
        }
        
        // Local-first: the packaged app (and the offline-capable PWA) already
    // bundles every lib under js/lib, so prefer it and only fall back to CDN
    // when the local file is genuinely unavailable.
    var url = localLibs[name] || cdnLibs[name];
        if (!url) {
            console.warn('Unknown library:', name);
            if (callback) callback(false);
            return;
        }
        
        var script = document.createElement('script');
        script.src = url;
        script.onload = function() {
            loadedLibs[name] = true;
            console.log('Loaded:', name);
            if (callback) callback(true);
        };
        script.onerror = function() {
            // Try fallback: CDN only if local was tried first and failed
            var fallback = cdnLibs[name];
            if (fallback && fallback !== url) {
                script.src = fallback;
                script.onload = function() {
                    loadedLibs[name] = true;
                    console.log('Loaded fallback (CDN):', name);
                    if (callback) callback(true);
                };
                script.onerror = function() {
                    console.error('Failed to load:', name);
                    if (callback) callback(false);
                };
                document.head.appendChild(script);
            } else {
                console.error('Failed to load:', name);
                if (callback) callback(false);
            }
        };
        document.head.appendChild(script);
    };
    
    window.loadLibs = function(libs, onComplete) {
        var remaining = libs.length;
        libs.forEach(function(name) {
            window.loadLib(name, function(success) {
                remaining--;
                if (remaining === 0 && onComplete) onComplete();
            });
        });
    };
    
    // Initialize critical libs
    if (!isOnline) {
        console.log('Offline mode: loading local libraries');
        window.loadLibs(['jquery', 'bootstrap'], function() {
            console.log('Core libs loaded');
        });
    }
})();