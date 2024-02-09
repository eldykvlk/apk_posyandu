import { StatusBar } from "expo-status-bar";
import { Button, Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import { useEffect, useState, useRef } from "react";
import * as Notifications from 'expo-notifications';

export default function App() {
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "303234411910-o14q47hrkme9c90tfaccjhj42gvip65h.apps.googleusercontent.com",
    });

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      if (user.user.email === 'posyanduedellweis@gmail.com') {
        setUserInfo(user);
        setError(null);
      } else {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        setError('Hanya akun admin posyandu yang dapat login admin');
      }
    } catch (e) {
      setError('Login gagal. Silakan coba lagi.');
    }
  };

  const logout = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUserInfo(null);
    } catch (e) {
      setError(e.message || "An error occurred");
    }
  };

  const registerForPushNotificationsAsync = async () => {
    // Implement your notification registration logic here
  };

  return (
    <ImageBackground source={require('./assets/background.jpg')} style={styles.background}>
      <View style={styles.container}>
        {userInfo ? (
          <>
            <Image source={{ uri: userInfo.user.photo }} style={styles.profileImage} />
            <Text>{userInfo.user.givenName}</Text>
            <Button title="Masuk aplikasi" onPress={signin} />
            <Button title="Logout" onPress={logout} />
          </>
        ) : (
          <>
            <Text>{error}</Text>
            <Text style={styles.adminText}>Login sebagai admin</Text>
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Standard}
              color={GoogleSigninButton.Color.Dark}
              onPress={signin}
            />
            <View style={styles.buttonContainer}>
              <Button title="Masuk sebagai user" onPress={signin} />
            </View>
          </>
        )}
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Warna latar belakang dengan opasitas 50%
    alignItems: "center",
    justifyContent: "center",
  },
  adminText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  }
});
