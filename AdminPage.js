import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, BackHandler, PermissionsAndroid, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { request, PERMISSIONS } from 'react-native-permissions';

export default function AdminPage({ navigation }) {
  const webViewRef = useRef(null);

  useEffect(() => {
    const backAction = () => {
      if (webViewRef.current) {
        webViewRef.current.goBack();
        return true; // Mengembalikan nilai true untuk mencegah default action (keluar aplikasi)
      }
      return false; // Jika webViewRef.current null, kembalikan false agar default action dijalankan
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

    useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Izin Lokasi",
              message: "Aplikasi memerlukan akses ke lokasi Anda.",
              buttonNeutral: "Tanya Nanti",
              buttonNegative: "Batal",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Izin lokasi diberikan");
          } else {
            console.log("Izin lokasi ditolak");
          }
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();
  }, []);

  const handleShouldStartLoadWithRequest = (event) => {
    const url = event.url;
    if (url.includes('https://script.google.com/macros/s/AKfycbwvxkszbmmgUDABEVNdt--an3iuF-t7HFiCSNFJstUyTSslcoP8rdM8M0VKl4XNPnbA/exec')) {
      // Open the URL in an external browser
      Linking.openURL(url);
      return false; // Prevent the WebView from loading the URL
    }
    return true; // Allow the WebView to load the URL
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: 'https://posyandu.netlify.app/#/admin' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        geolocationEnabled={true} // Mengaktifkan akses lokasi dalam WebView
       allowsFullscreenVideo={true} // Memungkinkan video YouTube untuk beralih ke mode layar penuh
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
    width: '100%',
  },
});
