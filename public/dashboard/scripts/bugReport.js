(function () {
    'use strict';

    var MAX_LOG_ENTRIES = 200;
    var logs = [];
    var STORAGE_KEY = 'bugBtnPos';

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

    var btn = document.createElement('button');
    btn.id = 'bugReportBtn';
    btn.title = 'Report a bug';
    btn.innerHTML = '🐞';
    btn.style.cssText = 'position:fixed;top:12px;left:8px;z-index:9999;width:40px;height:40px;border-radius:50%;border:2px solid rgba(220,50,50,0.4);background:rgba(220,50,50,0.15);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);cursor:grab;font-size:22px;display:flex;align-items:center;justify-content:center;opacity:0.5;transition:opacity 0.2s,background 0.2s,border-color 0.2s;color:white;padding:0;line-height:1;user-select:none;-webkit-user-select:none;touch-action:none;';

    var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            var pos = JSON.parse(saved);
            btn.style.left = '';
            btn.style.right = '';
            btn.style.top = pos.top + 'px';
            if (isRtl) {
                btn.style.right = pos.left + 'px';
            } else {
                btn.style.left = pos.left + 'px';
            }
        } catch (e) {}
    } else if (isRtl) {
        btn.style.left = 'auto';
        btn.style.right = '8px';
    }

    btn.onmouseenter = function () { btn.style.opacity = '1'; btn.style.background = 'rgba(220,50,50,0.3)'; btn.style.borderColor = 'rgba(220,50,50,0.7)'; };
    btn.onmouseleave = function () {
        if (!btn.dragging) {
            btn.style.opacity = '0.5';
            btn.style.background = 'rgba(220,50,50,0.15)';
            btn.style.borderColor = 'rgba(220,50,50,0.4)';
        }
    };

    btn.onclick = function (e) {
        if (btn.dragging) return;
        openBugReport();
    };

    // ── Drag logic ──
    var dragState = null;

    function startDrag(clientX, clientY) {
        var rect = btn.getBoundingClientRect();
        dragState = {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top,
            startX: rect.left,
            startY: rect.top
        };
        btn.dragging = true;
        btn.style.cursor = 'grabbing';
        btn.style.opacity = '1';
        btn.style.background = 'rgba(220,50,50,0.3)';
        btn.style.borderColor = 'rgba(220,50,50,0.7)';
        btn.style.transition = 'none';
    }

    function moveDrag(clientX, clientY) {
        if (!dragState) return;
        var x = clientX - dragState.offsetX;
        var y = clientY - dragState.offsetY;
        var maxX = window.innerWidth - 44;
        var maxY = window.innerHeight - 44;
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
        btn.style.left = x + 'px';
        btn.style.top = y + 'px';
        btn.style.right = 'auto';
    }

    function endDrag() {
        if (!dragState) return;
        dragState = null;
        btn.dragging = false;
        btn.style.cursor = 'grab';
        btn.style.transition = 'opacity 0.2s,background 0.2s,border-color 0.2s';
        btn.style.opacity = '0.5';
        btn.style.background = 'rgba(220,50,50,0.15)';
        btn.style.borderColor = 'rgba(220,50,50,0.4)';
        var left = parseInt(btn.style.left, 10);
        var top = parseInt(btn.style.top, 10);
        if (!isNaN(left) && !isNaN(top)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ left: left, top: top }));
        }
    }

    btn.addEventListener('mousedown', function (e) {
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
    });

    document.addEventListener('mousemove', function (e) {
        moveDrag(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', function () {
        endDrag();
    });

    btn.addEventListener('touchstart', function (e) {
        var t = e.touches[0];
        startDrag(t.clientX, t.clientY);
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        var t = e.touches[0];
        moveDrag(t.clientX, t.clientY);
    }, { passive: true });

    document.addEventListener('touchend', function () {
        endDrag();
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(btn); });
    } else {
        document.body.appendChild(btn);
    }

    // ── Bug report modal ──
    function openBugReport() {
        var overlay = document.createElement('div');
        overlay.id = 'bugReportOverlay';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;font-family:Tahoma,Roboto,sans-serif;';

        overlay.innerHTML =
            '<div style="background:#1e1e2e;border-radius:16px;padding:28px 32px;max-width:500px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.08);color:#e0e0e0;">' +
            '  <h2 style="margin:0 0 8px;font-size:20px;color:#dc3232;">🐞 Report a Bug</h2>' +
            '  <p style="margin:0 0 20px;font-size:13px;color:rgba(255,255,255,0.5);">Describe what happened. A screenshot and console logs will be attached.</p>' +
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

        var capturedScreenshot = null;

        doScreenshot(function (screenshot) {
            capturedScreenshot = screenshot;
            statusEl.textContent = 'Saving report...';
            saveReport(desc, capturedScreenshot, statusEl, submitBtn, overlay);
        }, function () {
            statusEl.textContent = 'Screenshot unavailable, saving report without it.';
            saveReport(desc, null, statusEl, submitBtn, overlay);
        });
    }

    function doScreenshot(onSuccess, onFail) {
        if (typeof html2canvas === 'undefined') {
            var s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            s.onload = function () { doCapture(onSuccess, onFail); };
            s.onerror = onFail;
            document.head.appendChild(s);
        } else {
            doCapture(onSuccess, onFail);
        }
    }

    function doCapture(onSuccess, onFail) {
        if (typeof html2canvas === 'undefined') { onFail(); return; }
        html2canvas(document.body, {
            backgroundColor: '#0f172a',
            scale: 1,
            useCORS: true,
            logging: false
        }).then(function (canvas) {
            onSuccess(canvas.toDataURL('image/jpeg', 0.7));
        }).catch(function () {
            onFail();
        });
    }

    function saveReport(desc, screenshot, statusEl, submitBtn, overlay) {
        if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
            saveToFirebase(desc, screenshot, statusEl, submitBtn, overlay);
        } else {
            downloadReport(desc, screenshot, statusEl, submitBtn, overlay);
        }
    }

    function saveToFirebase(desc, screenshot, statusEl, submitBtn, overlay) {
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
                downloadReport(desc, screenshot, statusEl, submitBtn, overlay);
            } else {
                statusEl.textContent = '✓ Report submitted. Thank you!';
                statusEl.style.color = '#4caf50';
                submitBtn.textContent = 'Submitted';
                setTimeout(function () { overlay.remove(); }, 2000);
            }
        });
    }

    function downloadReport(desc, screenshot, statusEl, submitBtn, overlay) {
        var report = {
            description: desc,
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            logs: logs.slice(-100)
        };
        if (screenshot) report.screenshot = screenshot;

        var blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'bug-report-' + Date.now() + '.json';
        a.click();
        URL.revokeObjectURL(a.href);

        statusEl.textContent = '✓ Report downloaded. Please share it with the developer.';
        statusEl.style.color = '#4caf50';
        submitBtn.textContent = 'Downloaded';
        setTimeout(function () { overlay.remove(); }, 3000);
    }

})();
