@echo off
echo ===============================
echo ANDROID RELEASE BUILD STARTING
echo ===============================

gradlew --stop ^
&& gradlew clean ^
&& gradlew assembleRelease ^
&& echo =============================== ^
&& echo BUILD SUCCESS ^
&& echo APK LOCATION: ^
&& echo app\build\outputs\apk\release\app-release.apk ^
&& echo ===============================

pause
