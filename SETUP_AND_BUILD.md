# Red Thread App: setup, Android packaging, and demo guide

## What this repository contains

Red Thread is a React + Vite web application packaged for Android with Capacitor.
The web source lives in `src/` and `public/`. The generated Android Gradle project
lives in `android/`.

The Android app identifier is `com.adititripathi.redthread` and its display name is
**Red Thread**.

## How the APK was created

1. The supplied React/Vite project was built with `npm run build`.
2. Capacitor was added with `@capacitor/core`, `@capacitor/android`, and
   `@capacitor/cli`.
3. `capacitor.config.ts` defines the Android app identifier, display name, and
   `dist` as the web asset directory.
4. Capacitor generated the Gradle project in `android/`, and `npx cap sync android`
   copied the built web assets into that project.
5. Gradle produced the debug APK with `assembleDebug`.

Generated dependencies, local SDK settings, build folders, and APKs are ignored by
Git. They can always be reproduced with the steps below.

## Prerequisites

- Node.js 20 or newer
- Java 21
- Android SDK Platform 36
- Android SDK Build-Tools 36.0.0

Set `ANDROID_HOME` to your SDK location, or create `android/local.properties` with
the following line (use your own local path):

```properties
sdk.dir=C\:\\path\\to\\Android\\Sdk
```

## Build from a fresh clone

From the repository root:

```powershell
npm install --legacy-peer-deps
npm run build
npx cap sync android
```

Then build the debug APK:

```powershell
cd android
.\gradlew.bat assembleDebug
```

The result is:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

## Install on an Android phone

Copy only `app-debug.apk` to the phone—USB file transfer is the fastest option.
Open it from the Android Files app and allow installation from that source when
prompted. This is a debug APK intended for development and hackathon demos.

## Updating the Android app after web changes

Whenever files in `src/` or `public/` change, rerun:

```powershell
npm run build
npx cap sync android
cd android
.\gradlew.bat assembleDebug
```
