# build-release.ps1
# PowerShell helper to build a signed release APK for the gigsapp module.

param(
    [switch]$install
)

$proj = "$PSScriptRoot"
cd $proj

# Check wrapper exists
if (-Not (Test-Path "$proj\gradlew.bat")) {
    Write-Host "gradlew.bat not found in $proj. Please run gradle wrapper or use create-wrapper.ps1 first."
    exit 1
}

# Ensure keystore properties exist
if (-Not (Test-Path (Join-Path $proj 'keystore.properties'))) {
    Write-Host "keystore.properties not found in $proj. Copy keystore.properties.template to keystore.properties and fill values."
    exit 1
}

# Build release
Write-Host "Building signed release APK..."
& .\gradlew.bat :gigsapp:app:assembleRelease
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. See Gradle output."; exit $LASTEXITCODE
}

$apk = Join-Path $proj "gigsapp\app\build\outputs\apk\release\app-release.apk"
if (Test-Path $apk) {
    Write-Host "Release APK created at: $apk"
    if ($install) {
        Write-Host "Installing on connected device (adb must be in PATH)..."
        & adb install -r $apk
    }
} else {
    Write-Host "APK not found at expected path: $apk"; exit 1
}
