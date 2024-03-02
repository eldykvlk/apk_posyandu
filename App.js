import * as Notifications from 'expo-notifications';
import React, { useEffect, useState, useRef } from "react";
import { Button, Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NetInfo from "@react-native-community/netinfo"; // Perlu diimpor NetInfo
import { GoogleSignin, GoogleSigninButton } from "@react-native-google-signin/google-signin";
import UserPage from './UserPage';
import AdminPage from './AdminPage';

const Stack = createStackNavigator();

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "212561971443-9qshupddu0dr8di8unki67c84jn3pbfr.apps.googleusercontent.com",
    });

    setTimeout(() => {
      setShowSplash(false);
    }, 4000);

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

  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access notifications denied!');
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  };

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

  const logout = () => {
    setUserInfo();
    GoogleSignin.revokeAccess();
    GoogleSignin.signOut();
  };

   return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {props => <Home {...props} userInfo={userInfo} signin={signin} logout={logout} />}
            </Stack.Screen>
            <Stack.Screen name="UserPage" component={UserPage} options={{ title: 'User Page' }} />
            <Stack.Screen name="AdminPage" component={AdminPage} options={{ title: 'Admin Page' }} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}

function SplashScreen() {
  return (
    <ImageBackground source={require('./assets/splash.png')} style={styles.background}>
      <View style={styles.splashContainer}>
        <Image source={require('./assets/splash.png')} style={styles.splashImage} />
      </View>
    </ImageBackground>
  );
}

function Home({ navigation, userInfo, signin, logout }) {
  const [isConnected, setIsConnected] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkInternetConnection = async () => {
      const connectionInfo = await NetInfo.fetch();
      setIsConnected(connectionInfo.isConnected);
    };

    checkInternetConnection();
  }, []);

  return (
    <ImageBackground source={require('./assets/background.jpg')} style={styles.background}>
      <View style={styles.container}>
        {userInfo ? (
          <>
            <Image source={{ uri: userInfo.user.photo }} style={styles.profileImage} />
            <Text>{userInfo.user.givenName}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Masuk aplikasi" onPress={() => navigation.navigate('AdminPage')} />
              <View style={styles.buttonSpacing} />
              <Button title="Logout" onPress={logout} />
            </View>
          </>
        ) : (
          <>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <Text style={styles.adminText}>Login sebagai admin</Text>
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Standard}
              color={GoogleSigninButton.Color.Dark}
              onPress={signin}
            />
            <View style={styles.buttonContainer}>
              <Button title="Masuk sebagai peserta" onPress={() => navigation.navigate('UserPage')} />
              {!isConnected && <Text style={styles.errorText}>Harap nyalakan internet agar bisa masuk</Text>}
            </View>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: '100%',
    height: '100%', // Menggunakan 100% dari tinggi dan lebar layar untuk gambar splash
    resizeMode: 'cover',
  },
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
  },
  buttonSpacing: {
    marginVertical: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginTop: 10,
  },
});
