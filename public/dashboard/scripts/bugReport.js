(function () {
    'use strict';

    var MAX_LOG_ENTRIES = 200;
    var logs = [];

    // Intercept console methods
    function captureConsole(method) {
        var original = console[method].bind(console);
        console[method] = function () {
            var args = [];
            for (var i = 0; i < arguments.length; i++) {
                try {
                    args.push(typeof arguments[i] === 'object' ? JSON.stringify(arguments[i], null, 2) : String(arguments[i]));
                } catch (e) {
                    args.push('[unstringifiable]');
                }
            }
            logs.push({ method: method, text: args.join(' '), time: Date.now() });
            if (logs.length > MAX_LOG_ENTRIES) logs.shift();
            original.apply(console, arguments);
        };
    }
    captureConsole('log');
    captureConsole('warn');
    captureConsole('error');

    window.__bugReportLogs = logs;

    // Create button
    var btn = document.createElement('button');
    btn.id = 'bugReportBtn';
    btn.title = 'Report a bug';
    btn.innerHTML = '🐞';
    var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    btn.style.cssText = 'position:fixed;top:56px;' + (isRtl ? 'right' : 'left') + ':8px;z-index:9999;width:36px;height:36px;border-radius:50%;border:2px solid rgba(220,50,50,0.4);background:rgba(220,50,50,0.15);backdrop-filter:blur(6px);cursor:pointer;font-size:20px;display:flex;align-items:center;justify-content:center;opacity:0.5;transition:opacity 0.2s,background 0.2s,border-color 0.2s;color:white;padding:0;';

    btn.onmouseenter = function () { btn.style.opacity = '1'; btn.style.background = 'rgba(220,50,50,0.3)'; btn.style.borderColor = 'rgba(220,50,50,0.7)'; };
    btn.onmouseleave = function () { btn.style.opacity = '0.5'; btn.style.background = 'rgba(220,50,50,0.15)'; btn.style.borderColor = 'rgba(220,50,50,0.4)'; };

    btn.onclick = function () { openBugReport(); };

    document.addEventListener('DOMContentLoaded', function () {
        document.body.appendChild(btn);
    });

    function openBugReport() {
        var overlay = document.createElement('div');
        overlay.id = 'bugReportOverlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;font-family:Tahoma,Roboto,sans-serif;direction:ltr;';

        overlay.innerHTML =
            '<div style="background:#1e1e2e;border-radius:16px;padding:28px 32px;max-width:500px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.08);color:#e0e0e0;">' +
            '  <h2 style="margin:0 0 8px;font-size:20px;color:#dc3232;">🐞 Report a Bug</h2>' +
            '  <p style="margin:0 0 20px;font-size:13px;color:rgba(255,255,255,0.5);">Describe what happened. A screenshot and console logs will be attached automatically.</p>' +
            '  <textarea id="bugReportDesc" placeholder="Describe the bug..." style="width:100%;box-sizing:border-box;min-height:100px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px;color:#e0e0e0;font-size:14px;font-family:inherit;resize:vertical;outline:none;margin-bottom:16px;"></textarea>' +
            '  <div style="display:flex;gap:12px;justify-content:flex-end;">' +
            '    <button id="bugReportCancel" style="background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.7);border:1px solid rgba(255,255,255,0.12);padding:10px 24px;border-radius:8px;cursor:pointer;font-size:14px;font-family:inherit;">Cancel</button>' +
            '    <button id="bugReportSubmit" style="background:linear-gradient(135deg,#f0c040,#e6a800);color:#0a0e27;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;font-family:inherit;">Submit Report</button>' +
            '  </div>' +
            '  <div id="bugReportStatus" style="margin-top:12px;font-size:13px;display:none;"></div>' +
            '</div>';

        document.body.appendChild(overlay);

        document.getElementById('bugReportCancel').onclick = function () { overlay.remove(); };
        overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });

        document.getElementById('bugReportSubmit').onclick = function () {
            submitBugReport(overlay);
        };

        setTimeout(function () {
            document.getElementById('bugReportDesc').focus();
        }, 100);
    }

    function submitBugReport(overlay) {
        var desc = document.getElementById('bugReportDesc').value.trim();
        if (!desc) {
            document.getElementById('bugReportDesc').style.borderColor = '#ff6b6b';
            return;
        }

        var statusEl = document.getElementById('bugReportStatus');
        var submitBtn = document.getElementById('bugReportSubmit');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Capturing...';
        statusEl.style.display = 'block';
        statusEl.textContent = 'Taking screenshot...';
        statusEl.style.color = 'rgba(255,255,255,0.5)';

        ensureHtml2canvas(function () {
            statusEl.textContent = 'Processing...';
            html2canvas(document.body, {
                backgroundColor: '#0f172a',
                scale: 1,
                useCORS: true,
                logging: false
            }).then(function (canvas) {
                var screenshot = canvas.toDataURL('image/jpeg', 0.7);
                statusEl.textContent = 'Saving to database...';
                saveToFirebase(desc, screenshot, statusEl, submitBtn, overlay);
            }).catch(function (err) {
                statusEl.textContent = 'Screenshot failed, saving without it.';
                saveToFirebase(desc, null, statusEl, submitBtn, overlay);
            });
        });
    }

    function ensureHtml2canvas(cb) {
        if (typeof html2canvas !== 'undefined') { cb(); return; }
        var s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        s.onload = cb;
        s.onerror = function () {
            document.getElementById('bugReportStatus').textContent = 'Failed to load screenshot library. Saving without screenshot.';
            saveToFirebase(desc, null, document.getElementById('bugReportStatus'), document.getElementById('bugReportSubmit'), overlay);
        };
        document.head.appendChild(s);
    }

    function saveToFirebase(desc, screenshot, statusEl, submitBtn, overlay) {
        if (typeof firebase === 'undefined' || !firebase.apps.length) {
            statusEl.textContent = 'Firebase not available. Cannot save report.';
            statusEl.style.color = '#ff6b6b';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Report';
            return;
        }

        var report = {
            description: desc,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            logs: logs.slice(-100)
        };

        if (screenshot) report.screenshot = screenshot;
        if (firebase.auth().currentUser) report.uid = firebase.auth().currentUser.uid;

        var ref = firebase.database().ref('bugReports').push();
        ref.set(report, function (error) {
            if (error) {
                statusEl.textContent = 'Failed to save: ' + error.message;
                statusEl.style.color = '#ff6b6b';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Report';
            } else {
                statusEl.textContent = '✓ Report submitted. Thank you!';
                statusEl.style.color = '#4caf50';
                submitBtn.textContent = 'Submitted';
                setTimeout(function () { overlay.remove(); }, 2000);
            }
        });
    }

})();
