import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bechstein.example',
  appName: 'example',
  webDir: 'dist/example/browser',
  server: {
    androidScheme: 'https',
  },
};

export default config;
