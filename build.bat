@echo off
REM =====================================================
REM build.bat — Build Quran Lights Android App
REM =====================================================
REM Usage: build.bat [debug|release]
REM =====================================================

setlocal

REM ── Set paths ──
set JAVA_HOME=D:\Android\jdk-21.0.5
set ANDROID_HOME=D:\Android\Sdk
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%PATH%

REM ── Get build type ──
set BUILD_TYPE=%1
if "%BUILD_TYPE%"=="" set BUILD_TYPE=release

echo.
echo ================================================
echo Building Quran Lights - %BUILD_TYPE% build
echo ================================================
echo.

cd /d "%~dp0android"

if /i "%BUILD_TYPE%"=="debug" (
    echo Building DEBUG APK...
    call gradlew.bat assembleDebug
    set OUTPUT_DIR=app\build\outputs\apk\debug
    set OUTPUT_NAME=app-debug.apk
) else if /i "%BUILD_TYPE%"=="release" (
    echo Building RELEASE APK...
    call gradlew.bat assembleRelease
    set OUTPUT_DIR=app\build\outputs\apk\release
    set OUTPUT_NAME=app-release.apk
) else (
    echo Unknown build type: %BUILD_TYPE%
    echo Usage: build.bat [debug^|release]
    exit /b 1
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo BUILD FAILED!
    exit /b 1
)

echo.
echo ================================================
echo BUILD SUCCESSFUL!
echo ================================================
echo Output: %OUTPUT_DIR%\%OUTPUT_NAME%
echo.

REM ── Copy to output folder ──
if not exist "%~dp0output" mkdir "%~dp0output"
copy /y "%~dp0%OUTPUT_DIR%\%OUTPUT_NAME%" "%~dp0output\" >nul
echo Copied to: output\%OUTPUT_NAME%

endlocal
exit /b 0