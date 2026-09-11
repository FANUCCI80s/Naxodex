import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.NAXODEX.app",
  appName: "NAXODEX",
  webDir: "public",
  server: {
    url: "https://xn--thsoros-cya.com",
    cleartext: false,
  },
};

export default config;