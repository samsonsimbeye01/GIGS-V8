# create-wrapper.ps1
# Manual Gradle wrapper creation for offline environments.
# Run this in PowerShell as Administrator from the repository root.

$proj = "$PSScriptRoot"
$gradleVersion = '8.6'
$zip = "gradle-$gradleVersion-bin.zip"

Write-Host "Working in: $proj"

cd $proj

if (-Not (Test-Path $zip)) {
    Write-Host "Downloading Gradle $gradleVersion..."
    Invoke-WebRequest -Uri "https://services.gradle.org/distributions/$zip" -OutFile $zip
}

$extracted = "$proj\gradle-dist"
Remove-Item -Recurse -Force $extracted -ErrorAction SilentlyContinue

Write-Host "Extracting $zip to $extracted"
Expand-Archive -Path $zip -DestinationPath $extracted

$srcWrapperJar = Join-Path $extracted "gradle-$gradleVersion\lib\gradle-wrapper.jar"
$destWrapperDir = "$proj\gradle\wrapper"
New-Item -ItemType Directory -Force -Path $destWrapperDir | Out-Null
Copy-Item -Path $srcWrapperJar -Destination (Join-Path $destWrapperDir 'gradle-wrapper.jar') -Force

$gwProps = @"
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https://services.gradle.org/distributions/gradle-$gradleVersion-all.zip
"@
Set-Content -Path (Join-Path $destWrapperDir 'gradle-wrapper.properties') -Value $gwProps -Encoding UTF8

$gradlewSh = @"#!/usr/bin/env sh
# Minimal gradlew that launches the gradle wrapper jar
PRG=\"\$0\"
exec \"\$JAVA_HOME/bin/java\" -jar \"\`\"\`\$PWD/gradle/wrapper/gradle-wrapper.jar\`\"\`\" \"\$@\"
"@
Set-Content -Path (Join-Path $proj 'gradlew') -Value $gradlewSh -Encoding ASCII

$gradlewBat = @"@echo off
setlocal
set DIRNAME=%~dp0
""%JAVA_HOME%\bin\java.exe"" -jar "%DIRNAME%gradle\wrapper\gradle-wrapper.jar" %*
"@
Set-Content -Path (Join-Path $proj 'gradlew.bat') -Value $gradlewBat -Encoding ASCII

Write-Host 'Manual wrapper creation complete.'
Write-Host "Now run: .\gradlew clean :gigsapp:app:assembleDebug"
