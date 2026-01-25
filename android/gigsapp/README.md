gigsapp - Java Android multi-module sample

This folder contains a small self-contained Android multi-module project using Java and XML layouts.

Modules:
- app: Android application module (package com.gigsapp)
- gidle: Android library module (package com.gigsapp.gidle)

Quick build (PowerShell):

cd "C:\Users\User\Downloads\GIGS V8\android\gigsapp"
.\gradlew clean :app:assembleDebug

Run unit tests:
.\gradlew :app:testDebugUnitTest

Run lint:
.\gradlew :app:lintDebug

Notes:
- This project is intentionally self-contained under `android/gigsapp` to avoid modifying any existing Android project in the repo.
- Requires a JDK and Android SDK with platform 33 installed and Gradle wrapper available. If wrapper is missing, run `gradle wrapper` to create it.
