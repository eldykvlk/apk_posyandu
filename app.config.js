export default {
  expo: {
    name: "login",
    slug: "login",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: ["@react-native-google-signin/google-signin"],
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.eldy.login",
      googleServicesFile: "./google-services.json",
    },
    android: {

      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.eldy.login",
      googleServicesFile: "./google-services.json",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "df276d73-6386-467c-94d4-27e2ff655aca",
      },
    },
  },
};

// process.env.GOOGLE_SERVICES_INFOPLIST
// process.env.GOOGLE_SERVICES_JSON