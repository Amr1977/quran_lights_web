// =====================================================
// libs.js — Local bundled JavaScript libraries for offline use
// =====================================================
// This file contains minified versions of libraries needed for full offline functionality
// to avoid depending on CDN resources that won't work without internet.
// =====================================================

// NOTE: This is a placeholder. For production, you should download and include:
// 1. jQuery 2.1.3+
// 2. Bootstrap 3.3.7+
// 3. HighCharts 8.0.0+ (with all modules)
// 4. Firebase SDK 4.2.0+

// For now, we'll implement minimal fallbacks for critical functionality
// and lazy-load the rest when online.

(function() {
    'use strict';

    // Lazy load scripts - they will only be fetched if needed and user is online
    window.loadScript = function(src, callback) {
        var script = document.createElement('script');
        script.src = src;
        script.onload = callback;
        script.onerror = function() {
            console.warn('Failed to load:', src);
            if (callback) callback(false);
        };
        document.head.appendChild(script);
    };

    window.loadScripts = function(scripts, onComplete) {
        var remaining = scripts.length;
        scripts.forEach(function(src) {
            window.loadScript(src, function(success) {
                remaining--;
                if (remaining === 0 && onComplete) onComplete();
            });
        });
    };

    // Check if online, load scripts accordingly
    window.initLibs = function(criticalScripts, allScripts, callback) {
        if (navigator.onLine) {
            // Online - try CDN first
            window.loadScripts(criticalScripts, function() {
                window.loadScripts(allScripts, callback);
            });
        } else {
            // Offline - load local bundled versions
            console.log('Offline mode: using local libraries');
            // In a full implementation, we'd have local bundled versions here
            if (callback) callback();
        }
    };
})();