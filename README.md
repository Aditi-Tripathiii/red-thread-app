# Red Thread

Red Thread is a privacy-first mobile security companion designed to help people recognise scam messages, suspicious links, and risky app-permission patterns before they act.

Built as a hackathon-ready React app and packaged for Android, it presents a calm, practical security dashboard for everyday users—especially people who use UPI, mobile banking, messaging apps, and online payments.

## The problem

Scams often create urgency: an unexpected payment request, a fake delivery link, a threatening SMS, or an app requesting more access than it needs. In those moments, people need a fast way to pause, inspect, and understand the risk.

Red Thread brings those checks into one place.

## Key features

- **Security dashboard** — displays a protection score, recent risk signals, and an at-a-glance device-security status.
- **Threat scanner** — analyses pasted messages and URLs for common scam patterns, urgency cues, suspicious domains, impersonation language, and payment-pressure signals.
- **Privacy-aware redaction** — detects and masks sensitive information before content is sent for optional cloud analysis.
- **Suspicious-link inspection** — breaks down links and explains the signals that make a URL safe, suspicious, or high risk.
- **Alerts centre** — keeps a history of findings and highlights issues that need attention.
- **App and privacy audit** — demonstrates how users can review Android-visible risk indicators such as SMS, accessibility, and screen-overlay permissions.
- **Financial-app safety view** — focuses attention on apps that may affect UPI or mobile-banking safety.
- **Onboarding and controls** — lets users understand privacy choices and enable or pause protection features in the demo interface.
- **Android-ready** — uses Capacitor to package the React application as an installable Android app.

## How it works

1. A user pastes a message or URL into the scanner.
2. Red Thread identifies sensitive values and shows a redacted preview.
3. The local analyser checks for known risk patterns and URL signals.
4. If configured, the Express server can use Gemini for additional analysis; if no API key is available, the app falls back to local analysis.
5. The result is shown with a clear risk level and explanation so the user can decide what to do next.

> **Demo note:** The app uses sample data and simulated permission/audit results for the hackathon prototype. It does not independently read device SMS, notifications, installed apps, or bank accounts.

## Tech stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Express
- Google GenAI SDK with a local-analysis fallback
- Capacitor 8 for Android packaging
- Gradle and Android SDK for APK builds

## Run locally

### Prerequisites

- Node.js 20 or newer
- npm

### Install and start

```powershell
git clone https://github.com/Aditi-Tripathiii/red-thread-app.git
cd red-thread-app
npm install --legacy-peer-deps
Copy-Item .env.example .env.local
```

Add a Gemini key to `.env.local` only if you want cloud-powered analysis:

```text
GEMINI_API_KEY=your_key_here
```

Then start the application:

```powershell
npm run dev
```

The local server starts the React application and the optional analysis API together.

## Build the web application

```powershell
npm run build
```

To type-check the project:

```powershell
npm run lint
```

## Build the Android APK

### Required tools

- Java 21
- Android SDK Platform 36
- Android SDK Build-Tools 36.0.0

Set your SDK location in `android/local.properties`:

```properties
sdk.dir=C\:\\path\\to\\Android\\Sdk
```

Build and sync the web assets:

```powershell
npm run build
npx cap sync android
```

Create the debug APK:

```powershell
cd android
.\gradlew.bat assembleDebug
```

The APK will be created at:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

Copy only `app-debug.apk` to an Android phone, open it from the Files app, and allow installation from that source when prompted.

## Project structure

```text
src/
  components/     User interface for dashboard, scanning, alerts, audit, and settings
  context/        Shared security state and analysis history
  data/           Demo apps and scam scenarios
  hooks/          PWA installation behaviour
  types/          TypeScript models
  utils/          Local analyser, URL inspection, and sensitive-data redaction
android/          Capacitor-generated Android project
server.ts         Express server and optional Gemini analysis API
```

## Demo flow

1. Open the **Home** tab and point out the protection score and device-guard status.
2. Use **Scan** to paste a suspicious message or select a prepared scam scenario.
3. Show the sensitive-data redaction preview and explain the risk assessment.
4. Open **Alerts** to show recorded findings.
5. Use **App Audit** to discuss risky permissions and financial-app protection.

## Privacy and safety

Red Thread is designed to make risk information understandable, not to replace professional security advice. Do not enter real passwords, OTPs, card numbers, or banking credentials into any demo application. Use the redaction preview and local-analysis mode during public demonstrations whenever possible.

## Additional build details

For the complete record of the Android packaging workflow, see [SETUP_AND_BUILD.md](SETUP_AND_BUILD.md).
