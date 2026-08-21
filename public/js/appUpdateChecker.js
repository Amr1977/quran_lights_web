/**
 * appUpdateChecker.js - Checks for app updates via GitHub Releases API
 * Fetches the latest release, extracts version from release name,
 * and compares with current app version.
 */
var UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000;
var LAST_UPDATE_CHECK_KEY = 'last_app_update_check';
var GITHUB_REPO = 'Amr1977/quran_lights_web';
var GITHUB_API_URL = 'https://api.github.com/repos/' + GITHUB_REPO + '/releases/latest';
var APK_ASSET_NAME = 'quran-lights-android.apk';

function checkForAppUpdate() {
  if (!window.APP_VERSION) return;

  var now = Date.now();
  var lastCheck = localStorage.getItem(LAST_UPDATE_CHECK_KEY);
  if (lastCheck && (now - parseInt(lastCheck)) < UPDATE_CHECK_INTERVAL) {
    return;
  }

  localStorage.setItem(LAST_UPDATE_CHECK_KEY, now);

  fetch(GITHUB_API_URL)
    .then(function(response) {
      if (!response.ok) throw new Error('GitHub API error: ' + response.status);
      return response.json();
    })
    .then(function(release) {
      var latestVersion = null;
      var match = release.name.match(/v?(\d+\.\d+\.\d+)/);
      if (match) {
        latestVersion = match[1];
      }

      if (!latestVersion) {
        console.log('[UpdateChecker] Could not extract version from release name:', release.name);
        return;
      }

      if (compareVersions(latestVersion, window.APP_VERSION) <= 0) {
        return;
      }

      var apkAsset = release.assets.find(function(asset) {
        return asset.name === APK_ASSET_NAME;
      });
      var apkUrl = apkAsset ? apkAsset.browser_download_url : 'https://github.com/' + GITHUB_REPO + '/releases/latest/download/' + APK_ASSET_NAME;

      showUpdateDialog(latestVersion, apkUrl);
    })
    .catch(function(err) {
      console.log('[UpdateChecker] Failed:', err.message);
    });
}

function compareVersions(a, b) {
  var aParts = a.split('.').map(Number);
  var bParts = b.split('.').map(Number);
  var len = Math.max(aParts.length, bParts.length);
  for (var i = 0; i < len; i++) {
    var aPart = aParts[i] || 0;
    var bPart = bParts[i] || 0;
    if (aPart > bPart) return 1;
    if (aPart < bPart) return -1;
  }
  return 0;
}

function showUpdateDialog(version, apkUrl) {
  var t = function(key) {
    return window.i18n && window.i18n.getTranslation ? window.i18n.getTranslation('update.' + key) : null;
  };
  var title = t('title') || 'تحديث متاح';
  var message = t('message') || 'الإصدار {0} متاح للتحميل';
  var later = t('later') || 'لاحقاً';
  var download = t('download') || 'تحميل';

  message = message.replace('{0}', version);

  var overlay = document.createElement('div');
  overlay.id = 'updateOverlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;';

  var dialog = document.createElement('div');
  dialog.style.cssText = 'background:linear-gradient(135deg,#1e293b,#0f172a);border-radius:16px;padding:28px 24px;max-width:400px;width:100%;text-align:center;color:#fff;box-shadow:0 20px 60px rgba(0,0,0,0.5);';

  dialog.innerHTML =
    '<div style="font-size:48px;margin-bottom:12px;">📲</div>' +
    '<h2 style="margin:0 0 8px;font-size:20px;font-weight:700;">' + title + '</h2>' +
    '<p style="color:#94a3b8;margin:0 0 20px;font-size:14px;line-height:1.6;">' + message + '</p>' +
    '<div style="display:flex;gap:12px;justify-content:center;">' +
      '<button id="updateLaterBtn" style="padding:12px 24px;border-radius:8px;border:1px solid #475569;background:transparent;color:#cbd5e1;cursor:pointer;font-size:14px;">' + later + '</button>' +
      '<button id="updateDownloadBtn" style="padding:12px 24px;border-radius:8px;border:none;background:#28a7e9;color:#fff;cursor:pointer;font-size:14px;font-weight:600;">' + download + '</button>' +
    '</div>';

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  document.getElementById('updateLaterBtn').onclick = function() { overlay.remove(); };
  document.getElementById('updateDownloadBtn').onclick = function() {
    overlay.remove();
    if (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Browser) {
      Capacitor.Plugins.Browser.open({ url: apkUrl });
    } else {
      window.open(apkUrl, '_blank');
    }
  };
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
}
