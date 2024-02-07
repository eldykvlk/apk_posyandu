import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
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
      setError(e.message || "An error occurred");
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
    <View style={styles.container}>
      <Text>{error}</Text>
      {userInfo && <Text>{JSON.stringify(userInfo.user)}</Text>}
      {userInfo ? (
        <Button title="Logout" onPress={logout} />
      ) : (
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Standard}
          color={GoogleSigninButton.Color.Dark}
          onPress={signin}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
