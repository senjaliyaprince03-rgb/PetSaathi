# PetSaathi Android Capacitor Setup

Phase 4 is configured as a Capacitor Android wrapper for the existing Next.js app.

This project is not a pure static Next.js site: it has API routes, middleware, authenticated portal pages, payments, uploads, and server-side session logic. Because of that, `output: "export"` is intentionally not enabled globally. Next.js static export disables API routes and middleware, which would break the production web app.

## Local Emulator Flow

1. Start the web app:

```powershell
npm run dev
```

2. In another terminal, sync Android to the local emulator URL:

```powershell
npm run android:sync:local
```

This uses `http://10.0.2.2:3000`, which is the Android emulator address for the host machine.

3. Open Android Studio:

```powershell
npm run cap:open
```

Run the `app` configuration on your Pixel emulator.

## Production Wrapper Flow

Use your deployed PetSaathi web URL when syncing:

```powershell
$env:CAPACITOR_SERVER_URL="https://your-production-domain.example"
npm run cap:sync
npm run cap:open
```

Build the debug APK from Android Studio, or from the terminal:

```powershell
cd android
.\gradlew.bat assembleDebug
```

The debug APK is created at:

```text
android\app\build\outputs\apk\debug\app-debug.apk
```

## Useful Checks

```powershell
java -version
npx cap doctor
adb version
```

## Release Notes

- Keep `.env` and signing keystores out of git.
- Store release keystore passwords in a password manager.
- For Play Store release, use Android Studio: Build > Generate Signed Bundle / APK.
- If you later build a separate static mobile-only frontend, you can switch `webDir` to `out` and add a dedicated static export build.
