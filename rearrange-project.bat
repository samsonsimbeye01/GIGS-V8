@echo off
echo ===================================================
echo Rearranging project files into proper Android structure
echo ===================================================

:: 1. Create folder structure
mkdir app 2>nul
mkdir app\src 2>nul
mkdir app\src\main 2>nul
mkdir app\src\main\java 2>nul
mkdir app\src\main\res 2>nul

:: 2. Move Java or Kotlin files into app\src\main\java
for %%f in (*.java *.kt) do (
    echo Moving %%f to app\src\main\java
    move "%%f" "app\src\main\java\"
)

:: 3. Move AndroidManifest.xml into app\src\main
if exist AndroidManifest.xml (
    echo Moving AndroidManifest.xml to app\src\main
    move "AndroidManifest.xml" "app\src\main\"
)

:: 4. Move app-level build.gradle into app folder
if exist app-build.gradle (
    echo Moving app-build.gradle to app\build.gradle
    move "app-build.gradle" "app\build.gradle"
)

:: 5. Move root-level build.gradle if exists
if exist root-build.gradle (
    echo Moving root-build.gradle to build.gradle
    move "root-build.gradle" "build.gradle"
)

:: 6. Move settings.gradle and gradle.properties to root if found
if exist settings.gradle (
    echo settings.gradle found
) else (
    echo settings.gradle missing
)
if exist gradle.properties (
    echo gradle.properties found
) else (
    echo gradle.properties missing
)

echo ===================================================
echo Project structure rearranged
echo ===================================================
pause

