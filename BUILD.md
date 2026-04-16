# Building Quran Lights Android App

## Prerequisites

- Java 21: `D:\Android\jdk-21.0.5`
- Android SDK: `D:\Android\Sdk`

## Quick Build

### Windows (PowerShell - Recommended)
```powershell
.\build.ps1           # Release build
.\build.ps1 -BuildType debug   # Debug build
```

### Windows (Batch)
```cmd
build.bat           # Release build
build.bat debug     # Debug build
```

## Output

APKs are copied to the `output/` folder:

| Build | File |
|-------|------|
| Debug | `output/app-debug.apk` |
| Release | `output/app-release.apk` |

## First-Time Setup (if needed)

1. **Install Java 21**
   ```powershell
   curl -L -o D:\Android\jdk-21.zip "https://download.oracle.com/java/21/archive/jdk-21.0.5_windows-x64_bin.zip"
   unzip -o D:\Android\jdk-21.zip -d D:\Android\
   ```

2. **Install Android SDK**
   ```powershell
   mkdir D:\Android\Sdk
   curl -L -o D:\Android\cmdline-tools.zip "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
   unzip -o D:\Android\cmdline-tools.zip -d D:\Android\Sdk\cmdline-tools\latest
   yes | D:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat --licenses
   D:\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat "platforms;android-34" "build-tools;34.0.0" "platform-tools"
   ```

## Play Store Upload

The release APK is signed and ready for upload to Google Play Store.

**Note:** Keep `android/app/quran-lights-release.keystore` safe - you'll need it for future updates!