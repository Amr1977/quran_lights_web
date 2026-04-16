# =====================================================
# build.ps1 — Build Quran Lights Android App
# =====================================================
# Usage: .\build.ps1 [-BuildType debug|release]
# =====================================================

param(
    [ValidateSet("debug", "release")]
    [string]$BuildType = "release"
)

$ErrorActionPreference = "Stop"

# Set paths
$env:JAVA_HOME = "D:\Android\jdk-21.0.5"
$env:ANDROID_HOME = "D:\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"

$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$androidDir = Join-Path $projectDir "android"

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Building Quran Lights - $BuildType build" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $androidDir

if ($BuildType -eq "debug") {
    Write-Host "Building DEBUG APK..." -ForegroundColor Yellow
    & .\gradlew.bat assembleDebug
    $outputDir = "app\build\outputs\apk\debug"
    $outputName = "app-debug.apk"
} else {
    Write-Host "Building RELEASE APK..." -ForegroundColor Yellow
    & .\gradlew.bat assembleRelease
    $outputDir = "app\build\outputs\apk\release"
    $outputName = "app-release.apk"
}

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "BUILD FAILED!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "BUILD SUCCESSFUL!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "Output: $outputDir\$outputName" -ForegroundColor Green

# Copy to output folder
$outputFolder = Join-Path $projectDir "output"
if (-not (Test-Path $outputFolder)) {
    New-Item -ItemType Directory -Path $outputFolder | Out-Null
}

$sourcePath = Join-Path $projectDir "$outputDir\$outputName"
$destPath = Join-Path $outputFolder $outputName
Copy-Item -Path $sourcePath -Destination $destPath -Force

Write-Host "Copied to: output\$outputName" -ForegroundColor Cyan
Set-Location $projectDir