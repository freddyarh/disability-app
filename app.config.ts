import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Respond Ability",
  slug: "RespondAbility",
  version: "1.0.7",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#000000"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  jsEngine: "hermes",
  ios: {
    supportsTablet: true,
    jsEngine: "jsc",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000"
    }
  },
  android: {
    package: "com.RespondAbility",
    versionCode: 7,
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#000000"
    },
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000"
    },
    "softwareKeyboardLayoutMode": "pan"
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    eas: {
      "projectId": "1e860de7-0387-4281-9bbd-de569aa8630b"
    }
  }
});
