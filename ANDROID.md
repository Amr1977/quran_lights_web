# Quran Lights — Android App Documentation

## Overview

This document describes how the Quran Lights web application was converted to a full Android app suitable for Google Play Store distribution with complete offline capability.

---

## 1. Project Structure

```
quran_lights_web/
├── android/                    # Capacitor Android project
│   ├── app/
│   │   ├── build.gradle        # App build config (signing, minify)
│   │   ├── quran-lights-release.keystore  # Play Store signing key
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── res/
│   ├── build.gradle           # Gradle config
│   ├── capacitor.config.json # Capacitor settings
│   └── gradle.properties
├── public/
│   ├── js/lib/              # Bundled offline libraries
│   │   ├── jquery.min.js
│   │   ├── bootstrap.min.js
│   │   ├── highcharts.min.js
│   │   ├── highcharts-more.js
│   │   ├── solid-gauge.js
│   │   └── bundle.js         # Library loader
│   ├── sw.js               # Service worker (offline caching)
│   └── manifest.json        # PWA manifest
├── build.ps1              # Build script (PowerShell)
├── build.bat             # Build script (Batch)
├── output/              # Built APKs
│   ├── app-debug.apk
│   └── app-release.apk
└── ANDROID.md            # This file
```

---

## 2. Android Configuration

### App Identity

| Setting | Value |
|---------|-------|
| Package Name | `com.quranlights.app` |
| App Name | Quran Lights |
| minSdkVersion | 22 (Android 5.1) |
| targetSdkVersion | 34 (Android 14) |
| versionCode | 1 |
| versionName | 1.0 |

### Permissions

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```

---

## 3. Offline Capability

### How It Works

1. **Local Libraries**
   - jQuery, Bootstrap, HighCharts bundled in `public/js/lib/`
   - Loaded automatically when offline
   - CDN fallback when online

2. **Service Worker** (`public/sw.js`)
   - Caches all app assets on install
   - Serves from cache when offline
   - Falls back to offline.html

3. **Data Storage**
   - localStorage for user data
   - Upload queue for sync when back online
   - IndexedDB via localforage

### Library Loader

```javascript
// Load libraries (tries CDN first, falls back to local)
window.loadLib('jquery', function(success) { ... });
window.loadLibs(['jquery', 'bootstrap'], function() { ... });
```

---

## 4. Build Process

### Prerequisites

| Tool | Location |
|------|----------|
| Java 21 | `D:\Android\jdk-21.0.5` |
| Android SDK | `D:\Android\Sdk` |
| SDK Platforms | android-34 |
| Build Tools | 34.0.0 |

### Build Commands

#### PowerShell (Recommended)
```powershell
# Release build
.\build.ps1

# Debug build
.\build.ps1 -BuildType debug
```

#### Batch
```cmd
build.bat
build.bat debug
```

### Build Output

| Build Type | File | Size | Signed |
|------------|------|------|-------|
| Debug | `output/app-debug.apk` | ~17 MB | No |
| Release | `output/app-release.apk` | ~14 MB | Yes (Play Store ready) |

### Signing

The release APK is signed with:
- **Keystore**: `android/app/quran-lights-release.keystore`
- **Alias**: `quran-lights`
- **Validity**: 10,000 days

**⚠️ IMPORTANT:** Keep the keystore file safe! You'll need it for all future updates.

---

## 5. Play Store Submission

### Requirements

1. **Google Play Developer Account** ($25 one-time fee)
2. **App Assets**
   - App icon: 512x512 PNG
   - Screenshots: Phone (360x640), 7-inch tablet (720x1280), 10-inch tablet (1920x1080)
   - Feature graphic: 1024x500
   - Privacy policy URL
3. **Store Listing**
   - Title (max 50 chars)
   - Short description (max 80 chars)
   - Full description (max 4000 chars)

### Upload Steps

1. Go to [Google Play Console](https://play.google.com/console)
2. Create app → Fill details
3. Upload `output/app-release.apk`
4. Complete store listing
5. Submit for review

---

## 6. Updating the App

### Version Bump

Edit `android/app/build.gradle`:
```groovy
defaultConfig {
    versionCode 1        // Increment for each release
    versionName "1.0"     // Change for users
}
```

### Rebuild

```powershell
.\build.ps1
```

### Upload

Upload new APK to Play Console → Submit update

---

## 7. Troubleshooting

### Build Fails - Java Not Found
```powershell
$env:JAVA_HOME = "D:\Android\jdk-21.0.5"
```

### Build Fails - SDK Not Found
```powershell
$env:ANDROID_HOME = "D:\Android\Sdk"
```

### APK Won't Install
- Enable "Install from unknown sources" on device
- Check if same package name app is already installed with different signature

### App Crashes on Launch
- Check LogCat: `adb logcat`
- Verify all assets are in `public/` folder

---

## 8. Development Notes

### Adding New Libraries

1. Download to `public/js/lib/`
2. Update `public/sw.js` → `LOCAL_LIBS` array
3. Update `public/js/lib/bundle.js` → `cdnLibs` and `localLibs`

### Changing App Icon

Replace files in `android/app/src/main/res/mipmap-*/`

### Changing Splash Screen

Edit `capacitor.config.json`:
```json
{
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#0f0f1a"
    }
  }
}
```

---

## 9. Files Reference

### Key Files

| File | Purpose |
|------|---------|
| `capacitor.config.json` | App configuration |
| `android/app/build.gradle` | Build & signing config |
| `android/app/src/main/AndroidManifest.xml` | Android manifest |
| `public/manifest.json` | PWA manifest |
| `public/sw.js` | Service worker |
| `public/js/lib/bundle.js` | Library loader |
| `build.ps1` | Build script |

### Generated Files

| File | Purpose |
|------|---------|
| `android/app/quran-lights-release.keystore` | Signing key (KEEP SAFE!) |
| `output/app-debug.apk` | Debug build |
| `output/app-release.apk` | Release build |

---

## 10. Contact & Support

- **Developer**: Quran Lights Team
- **Build Issues**: Check Java and Android SDK paths
- **Play Store**: See Google Play Console help

---

*Last Updated: April 2026*