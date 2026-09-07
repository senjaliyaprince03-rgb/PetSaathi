import { CapacitorConfig } from '@capacitor/cli';

const serverUrl = process.env.CAPACITOR_SERVER_URL ?? 'http://10.0.2.2:3000';

const config: CapacitorConfig = {
  appId: 'com.petsaathi.app',
  appName: 'PetSaathi',
  webDir: 'out',
  server: {
    // For local dev against live backend, point to host machine via Android emulator (10.0.2.2:3000).
    // For production, this block is removed and the static web assets in webDir are used.
    url: serverUrl,
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FFFFFF',
      showSpinner: false
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#FFFFFF'
    }
  }
};

export default config;
