export default {
  expo: {
    name: "posyandu",
    slug: "posyandu",
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
      bundleIdentifier: "com.posyandu.firebase",
      googleServicesFile: process.env.GOOGLE_SERVICES_INFOPLIST,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.posyandu.firebase",
      googleServicesFile: "./google-services.json",
      permissions: ["WRITE_EXTERNAL_STORAGE", "ACCESS_FINE_LOCATION"], // Tambahkan izin akses lokasi
    },
    web: {
      favicon: "./assets/favicon.png",
      geolocation: "true", // Aktifkan geolocation di web
    },
    extra: {
      eas: {
        projectId: "413c1e0e-4282-474c-a536-2625d4560787",
      },
    },
  },
};
