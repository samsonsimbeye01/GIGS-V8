# extract-wrapper.ps1
# Extract gradle-wrapper.jar from gradle-8.6-bin.zip and create gradlew scripts and wrapper properties

$zip = Join-Path (Get-Location) 'gradle-8.6-bin.zip'
if # PowerShell
# Save as `android\copy-gradle-wrapper.ps1`
# Usage: from `android` run: powershell -ExecutionPolicy Bypass -File .\copy-gradle-wrapper.ps1

$root = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).ProviderPath }
Set-Location -Path $root

$source = Join-Path $root 'gradle-8.6-bin\gradle-8.6\lib\gradle-wrapper.jar'
$targets = @(
    Join-Path $root 'gradle\wrapper\gradle-wrapper.jar',
    Join-Path $root 'gigsapp\gradle\wrapper\gradle-wrapper.jar'
)

if (-not (Test-Path $source)) {
    Write-Error "Source not found: $source"
    exit 1
}

foreach ($t in $targets) {
    $dir = Split-Path $t -Parent
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    Copy-Item -Path $source -Destination $t -Force
    if (Test-Path $t) {
        Write-Output "Copied: $t"
    } else {
        Write-Error "Failed to copy to: $t"
        exit 1
    }
}

Write-Output "Done."(-not (Test-Path $zip)) {
    Write-Error "ZIP_NOT_FOUND: $zip"
    exit 1
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zf = [System.IO.Compression.ZipFile]::OpenRead((Get-Item $zip).FullName)
$entry = $zf.Entries | Where-Object { $_.FullName -eq 'gradle-8.6/lib/gradle-wrapper.jar' }
if ($null -eq $entry) {
    Write-Error "ENTRY_NOT_FOUND: gradle-8.6/lib/gradle-wrapper.jar"
    $zf.Dispose()
    exit 2
}

$destWrapperDir = Join-Path (Get-Location) 'gradle\wrapper'
New-Item -ItemType Directory -Force -Path $destWrapperDir | Out-Null
$dest = Join-Path $destWrapperDir 'gradle-wrapper.jar'
$entry.ExtractToFile($dest, $true)

$props = @"
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https://services.gradle.org/distributions/gradle-8.6-all.zip
"@
Set-Content -Path (Join-Path $destWrapperDir 'gradle-wrapper.properties') -Value $props -Encoding UTF8

# Create gradlew (Unix) and gradlew.bat (Windows)
$gradlewSh = "#!/usr/bin/env sh`nexec \"\$JAVA_HOME/bin/java\" -jar \"\$PWD/gradle/wrapper/gradle-wrapper.jar\" \"\$@\""
Set-Content -Path (Join-Path (Get-Location) 'gradlew') -Value $gradlewSh -Encoding ASCII

$gradlewBat = "@echo off`r`nsetlocal`r
set DIRNAME=%~dp0`r
\"%JAVA_HOME%\\bin\\java.exe\" -jar \"%DIRNAME%gradle\\wrapper\\gradle-wrapper.jar\" %*"
Set-Content -Path (Join-Path (Get-Location) 'gradlew.bat') -Value $gradlewBat -Encoding ASCII

# Also copy wrapper jar and properties into the gigsapp module wrapper dir
$gigsappWrapperDir = Join-Path (Get-Location) 'gigsapp\gradle\wrapper'
New-Item -ItemType Directory -Force -Path $gigsappWrapperDir | Out-Null
Copy-Item -Path $dest -Destination (Join-Path $gigsappWrapperDir 'gradle-wrapper.jar') -Force
Set-Content -Path (Join-Path $gigsappWrapperDir 'gradle-wrapper.properties') -Value $props -Encoding UTF8

$zf.Dispose()
Write-Host 'EXTRACT_OK'
