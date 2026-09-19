import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.adititripathi.redthread',
  appName: 'Red Thread',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
