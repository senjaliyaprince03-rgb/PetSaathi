import type { CapacitorConfig } from '@capacitor/cli';

const serverUrl = process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.petsaathi.app',
  appName: 'PetSaathi',
  webDir: '.capacitor-web',
  server: serverUrl
    ? {
        url: serverUrl,
        cleartext: serverUrl.startsWith('http://'),
        androidScheme: 'https'
      }
    : {
        androidScheme: 'https'
      }
};

export default config;
