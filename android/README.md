Android project helper for GIGS V8

This folder contains the Android projects. To build and debug the merged `gigsapp` modules locally on Windows (PowerShell), follow these steps:

1. Install JDK (17+ recommended) and Android SDK with platform 33.

2. Generate Gradle wrapper (if not committed):

```powershell
cd "C:\Users\User\Downloads\GIGS V8\android"
gradle wrapper --gradle-version 8.0.2
```

3. Build debug APK:

```powershell
cd "C:\Users\User\Downloads\GIGS V8\android"
.\gradlew clean :gigsapp:app:assembleDebug
```

4. Run unit tests:

```powershell
cd "C:\Users\User\Downloads\GIGS V8\android"
.\gradlew :gigsapp:app:testDebugUnitTest
```

5. Run lint:

```powershell
cd "C:\Users\User\Downloads\GIGS V8\android"
.\gradlew :gigsapp:app:lintDebug
```

6. Install on connected device/emulator (requires ADB):

```powershell
cd "C:\Users\User\Downloads\GIGS V8\android"
.\gradlew :gigsapp:app:installDebug
```

Troubleshooting: "Unsupported class file major version 65" when running `gradle wrapper`

This error means your Java runtime is newer (Java 21, class file major version 65) than the Gradle/AGP toolchain you're trying to run. You have two options to fix it:

Option A — Use a Java 17 runtime for wrapper generation and builds (recommended):

1. Install a JDK 17 distribution (Temurin/Adoptium, Azul, or Oracle). Example: download from https://adoptium.net/ or use your package manager.

2. Open PowerShell and set `JAVA_HOME` for the session to the JDK 17 install path, then run the wrapper command. Replace the path below with your JDK 17 install location.

```powershell
# Example: set JAVA_HOME for this PowerShell session (adjust path to your JDK 17)
$env:JAVA_HOME = 'C:\Program Files\Java\jdk-17'
$env:Path = "$env:JAVA_HOME\bin;$env:Path"

# Now generate the wrapper (runs with Java 17)
gradle wrapper --gradle-version 8.0.2
```

After the wrapper is generated, build with:

```powershell
.\gradlew clean :gigsapp:app:assembleDebug
```

Option B — Use a Gradle version compatible with your installed Java (if you prefer keeping Java 21):

Some Gradle releases add support for newer Java versions. If you want to keep Java 21, try generating a wrapper with a newer Gradle release (for example 8.6 or later):

```powershell
# Generate wrapper using a Gradle installation that matches your Java version
gradle wrapper --gradle-version 8.6
```

If you get the same error when running `gradle` itself, it means the Gradle installation on PATH was started with the current Java — in that case either switch to a JDK 17 session (Option A) or install a newer Gradle binary that supports Java 21.

If things still fail, run the wrapper command with --stacktrace and share the full output so I can diagnose further:

```powershell
gradle wrapper --gradle-version 8.0.2 --stacktrace
```

Manual wrapper creation (if you cannot run `gradle` on PATH)

If `gradle` is not installed on your machine and the automatic `gradle wrapper` command fails or times out, you can manually create the wrapper files by downloading the Gradle distribution and extracting the wrapper jar. The commands below use PowerShell and will create `gradle\wrapper\gradle-wrapper.jar`, `gradlew` and `gradlew.bat` so you can run `./gradlew` locally.

Open PowerShell as administrator and run the following from the repository root (adjust paths as needed):

```powershell
# 1) Set target folder and Gradle version
$proj = "C:\Users\User\Downloads\GIGS V8\android"
$gradleVersion = '8.6'
$zip = "gradle-$gradleVersion-bin.zip"

# 2) Download Gradle binary distribution
cd $proj
if (-Not (Test-Path $zip)) {
    Write-Host "Downloading Gradle $gradleVersion..."
    Invoke-WebRequest -Uri "https://services.gradle.org/distributions/$zip" -OutFile $zip
}

# 3) Extract to a temp folder
$extracted = "$proj\gradle-dist"
Remove-Item -Recurse -Force $extracted -ErrorAction SilentlyContinue
Expand-Archive -Path $zip -DestinationPath $extracted

# 4) Copy gradle-wrapper.jar into the project wrapper folder
$srcWrapperJar = Join-Path $extracted "gradle-$gradleVersion\lib\gradle-wrapper.jar"
$destWrapperDir = "$proj\gradle\wrapper"
New-Item -ItemType Directory -Force -Path $destWrapperDir | Out-Null
Copy-Item -Path $srcWrapperJar -Destination (Join-Path $destWrapperDir 'gradle-wrapper.jar') -Force

# 5) Create gradle-wrapper.properties (if not present) – points to distribution URL
$gwProps = @"
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https://services.gradle.org/distributions/gradle-$gradleVersion-all.zip
"@
Set-Content -Path (Join-Path $destWrapperDir 'gradle-wrapper.properties') -Value $gwProps -Encoding UTF8

# 6) Create a Unix-style gradlew script
$gradlewSh = @"#!/usr/bin/env sh
# Minimal gradlew that launches the gradle wrapper jar
PRG="\$0"
exec "\$JAVA_HOME/bin/java" -jar "`"`$PWD/gradle/wrapper/gradle-wrapper.jar`" "\$@"
"@
Set-Content -Path (Join-Path $proj 'gradlew') -Value $gradlewSh -Encoding ASCII

# 7) Create a Windows gradlew.bat script
$gradlewBat = @"@echo off
setlocal
set DIRNAME=%~dp0
""%JAVA_HOME%\bin\java.exe"" -jar "%DIRNAME%gradle\wrapper\gradle-wrapper.jar" %*
"@
Set-Content -Path (Join-Path $proj 'gradlew.bat') -Value $gradlewBat -Encoding ASCII

# 8) Make the Unix script executable (if on WSL / cygwin)
if ($env:OS -eq 'Windows_NT') { Write-Host 'Created gradlew and gradlew.bat in the android folder.' } else { chmod +x gradlew }

Write-Host 'Manual wrapper creation complete. You can now run: .\\gradlew clean :gigsapp:app:assembleDebug'
```

Notes:
- The commands above download the Gradle binary zip and extract `gradle-wrapper.jar` into `android/gradle/wrapper/` and create simple `gradlew`/`gradlew.bat` launcher scripts.
- After this, run `.
gradlew clean :gigsapp:app:assembleDebug` from the `android` folder to build.
- If you cannot download files from the network in your environment, perform the same steps on another machine with network access, then copy the generated `gradle/wrapper/gradle-wrapper.jar`, `gradlew`, and `gradlew.bat` into this repo.

Release signing and building (create signed APK)

1) Prepare your environment
- Ensure Android Studio is updated to the latest stable version.
- Install Java JDK 17+ and ensure `java` is on your PATH (or set `JAVA_HOME` for the session).
- Confirm Git is installed and the project is cloned locally.
- Ensure stable internet for dependency downloads (Gradle will fetch dependencies on first run).

2) Configure app signing (keystore)
- Copy `keystore.properties.template` to `keystore.properties` in the `android/` folder.
- Edit `android/keystore.properties` and fill in your values (do NOT commit the real file).
- Place your `my-release-key.jks` (or your chosen keystore file) in the `android/` folder, or set `storeFile` path relative to `android/`.

3) Build signed APK (PowerShell)
- From the `android/` folder:

```powershell
# Generate wrapper if missing (one-time)
cd "C:\Users\User\Downloads\GIGS V8\android"
# If gradle is available on PATH
gradle wrapper --gradle-version 8.6
# or run the helper script
.\create-wrapper.ps1

# Build signed release
.\build-release.ps1
```

- To build and install to a connected device (ADB must be available in PATH):

```powershell
.\build-release.ps1 -install
```

4) Locate the APK
- The signed release APK will be at:
  `android\gigsapp\app\build\outputs\apk\release\app-release.apk`
- Install manually using ADB if desired:
  `adb install -r android\gigsapp\app\build\outputs\apk\release\app-release.apk`

5) Testing
- Test on an emulator or device. Ensure Developer Options & USB Debugging are enabled on your device.
- Verify main flows: offline behavior, real-time interactions, analytics, security features, and notifications. If video chat exists, ensure CAMERA and RECORD_AUDIO permissions are granted at runtime.

6) Troubleshooting common issues
- Gradle build fails: check `android/gradle.properties` and the Android Gradle Plugin version in `android/build.gradle`.
- Missing libraries: run `.\gradlew build --refresh-dependencies` from the `android/` folder.
- APK not installing: uninstall previous app or enable Install from Unknown Sources.
- Video chat issues: add required permissions to `AndroidManifest.xml` and request runtime permissions.

7) Sharing the APK
- Once tested, share `app-release.apk` via Google Drive, Dropbox, email (if <25MB), or upload to Google Play Beta.
