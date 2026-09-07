# PetSaathi Mobile App Testing Workflow (Android / Capacitor)

This guide documents how to build, run, and test the PetSaathi native Android shell on an emulator or a physical Android device.

---

## 1. Prerequisites

- **Android Studio**: Hedgehog (2023.1.1) or newer / Ladybug
- **Java Development Kit (JDK)**: JDK 17+ (or JDK 21/24) with JAVA_HOME configured
- **Android SDK**: API 34+ (Android 14) or API 36 with Build-Tools installed
- **Node.js**: v20.18.0+
- **PetSaathi Web Server**: Running locally on port 3000

---

## 2. Architecture & Static vs Dynamic Decision

PetSaathi is built with **Next.js 14/15 App Router** utilizing dynamic runtime features:
- NextAuth session cookie authentication
- Server Actions & dynamic Route Handlers (/api/*)
- Server-Sent Events / WebSockets for live walk tracking
- Razorpay payment signature verification

Because pure static HTML export (output: 'export') disables server-side API routes and middleware, PetSaathi uses the **Capacitor Live Server Bridge** approach:
- **capacitor.config.ts** sets server.url to http://10.0.2.2:3000 (the Android emulator alias for host machine localhost).
- **webDir: 'out'** provides a lightweight offline fallback shell (out/index.html) that automatically redirects to the active dev server.
- Cleartext traffic is enabled in debug builds via ndroid:usesCleartextTraffic="true" and ndroid/app/src/main/res/xml/network_security_config.xml to allow seamless local development without HTTPS certificates.

---

## 3. Local Development Commands

### Terminal 1: Start Next.js Development Server
`ash
npm run dev
`
Verify the server responds at http://localhost:3000.

### Terminal 2: Sync and Build the Android Shell

`ash
# Sync Capacitor plugins and assets
npm run cap:sync

# Build the debug APK via Gradle
npm run mobile:build

# Open the project in Android Studio (optional)
npm run cap:open

# Run directly on an emulator or USB-connected device
npm run cap:run:android
`

Alternatively, to install directly from the command line after starting an emulator:
`ash
cd android
./gradlew installDebug
`

---

## 4. Manual Test Scenarios on Android Emulator

### A. App Launch & Dev Server Bridge
1. Start an Android Virtual Device (AVD, e.g. Pixel 8 with API 34).
2. Launch **PetSaathi** from the launcher.
3. Confirm the app connects via http://10.0.2.2:3000 and displays the PetSaathi home/login screen.

### B. Customer Authentication
1. Navigate to the login screen.
2. Sign in with demo credentials:
   - **Email**: parent.bruno@petsaathi.test
   - **Password**: Password123!
3. Verify session persists across app restarts (NextAuth session token stored in webview cookie store).

### C. Booking Creation & Camera Permissions
1. Go to the booking creation flow (/dashboard or /customer/services).
2. Tap the pet photo / document upload button.
3. Verify that Android displays the native permission prompt for **Camera** (android.permission.CAMERA) and **Photos/Media** (android.permission.READ_MEDIA_IMAGES).
4. Snap a photo using the emulator camera or choose from gallery.

### D. Live Walk Simulation & Foreground GPS
1. In the customer portal, open the live walk tracking screen (/bookings/[id]/live).
2. Verify the native permission prompt for **Location** (ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION).
3. In the Android Studio emulator Extended Controls (... -> Location), send mock GPS coordinates inside the society boundary (e.g. 23.0338 N, 72.5850 E).
4. Verify the live Leaflet map centers on the coordinates and renders breadcrumb points.

### E. Backgrounding & Notifications
1. With an active walk session open, press the Home button on the device to send PetSaathi to the background.
2. Trigger a Saathi dispatch event or service update.
3. Confirm Android requests notification permission (POST_NOTIFICATIONS) on Android 13+ and displays the dispatch update alert.

---

## 5. Known Limitations & Roadmap

1. **Background GPS Breadcrumbs**: Full background tracking while the device screen is locked requires a dedicated foreground service with sticky notification. This will be hardened in a subsequent mobile-native phase.
2. **Push Notifications (FCM)**: Push notification reception is currently configured for local in-app alerts. Remote FCM requires provisioning a production google-services.json from the Firebase Console.
3. **Razorpay Mobile Checkout**: In an Android WebView, UPI intent flows require custom intent handling in MainActivity.java. For local dev, card and netbanking simulation modes are recommended.

---

## 6. Live Logs & Debugging

To view live Webview console logs and hot-reload changes:
`ash
npx cap run android --livereload
`
To inspect WebView elements from Chrome on your host machine:
1. Open Chrome on your desktop and navigate to chrome://inspect.
2. Locate the connected emulator / device under **Remote Target**.
3. Click **Inspect** to access the full Chrome DevTools for the running mobile app.
